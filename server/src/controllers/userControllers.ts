import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/UserModel";
import { generateAvatar } from "../utils/generateAvatar";
import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/getTokens";
import sendVerificationCode from "../emails/sendVerificationCode";
import sendWelcomeEmail from "../emails/sendWelcomeEmail";
import generateVerificationCode from "../utils/generateVerificationCode";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // Get details from client
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    // generate an avatar
    const avatarUrl = generateAvatar(email)

    // create the user
    const createdUser = await User.create({
        avatar: avatarUrl,
        fullName,
        email,
        password,
    })

    // generate access token, refresh token, verification code
    const accessToken = generateAccessToken(createdUser._id.toString(), createdUser.email, createdUser.fullName)
    const refreshToken = generateRefreshToken(createdUser._id.toString(), createdUser.email, createdUser.fullName)
    const verificationCode = generateVerificationCode();

    // save the required data to the database
    createdUser.refreshToken = refreshToken;
    createdUser.verificationCode = verificationCode;
    createdUser.verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000)

    // send the verification code to the client
    const data = await sendVerificationCode(createdUser.email, verificationCode)
    if (!data) {
        res.send("Failed to send Verification code mail to the user, please try again later!")
    }

    // save the user to the database
    await createdUser.save()

    // find the newly created user
    const user = await User.findById(createdUser._id).select("-password")

    // return a response and set cookies
    return res.status(200).cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 3499
    }).cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json(new ApiResponse(200, { user }, "User registered successfully!"))
})


const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    // get the verification code from the client
    const { verificationCode } = req.body;
    if (!verificationCode) {
        throw new ApiError(400, "Verification code is required")
    }

    // find the user using the verification code
    // check for the validity of the verification code
    const user = await User.findOne({
        verificationCode,
        verificationCodeExpiry: { $gt: Date.now() }
    }).select("-password")
    if (!user) {
        throw new ApiError(404, "Invalid verification code or code has expired")
    }

    // If all ok, modify isVerified field in the database to true and set verification code and expiry to undefined
    user.isVerified = true;
    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    await user.save()

    // send welcome email
    await sendWelcomeEmail(user.email, user.fullName)
    // return response
    return res.status(200).json(new ApiResponse(200, {}, "User verification successful"))
})


const resendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    // get client's email
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    // find it in database
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "No user found with this email, kindly register first")
    }

    // check if user is already verified
    if (user.isVerified) {
        throw new ApiError(403, "User is already verified")
    }

    // send new verification code, add it to database
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()
    const data = await sendVerificationCode(user.email, verificationCode)
    if (!data) {
        throw new ApiError(500, "Failed to send verification code")
    }

    return res.status(200).json(new ApiResponse(200, {}, "Verification code sent to provided email"))
})


const loginUser = asyncHandler(async (req: Request, res: Response) => {
    // get email and password from the user
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // find the user using email
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "No user found with this email")
    }

    // compare the password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        throw new ApiError(403, "Invalid password")
    }

    // generate refresh and access tokens
    const accessToken = generateAccessToken(user._id.toString(), user.email, user.fullName)
    const refreshToken = generateRefreshToken(user._id.toString(), user.email, user.fullName)

    user.refreshToken = refreshToken;
    await user.save()

    const loggedInUser = await User.findOne({ email }).select("-password")

    // send response
    return res.status(200).cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 3499
    }).cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json(new ApiResponse(200, { loggedInUser }, "User logged in successfully!"))
})


const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"))
})


const refreshAccessTokens = asyncHandler(async (req: Request, res: Response) => {
    // interface JwtPayloadz extends JwtPayload{
    //     _id: string
    // }

    // get the refresh tokens from the cookies
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
        throw new ApiError(400, "No refersh token found")
    }

    // decode the token
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
    if (!decodedToken) {
        throw new ApiError(401, "Invalid token")
    }

    // get the user using _id
    const user = await User.findById(decodedToken._id)
    if (!user) {
        throw new ApiError(404, "Invalid token")
    }

    // check for the validity of the token
    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // generate new access and refersh tokens
    const newAccessToken = generateAccessToken(user._id.toString(), user.email, user.fullName)
    const newRefreshToken = generateRefreshToken(user._id.toString(), user.email, user.fullName)

    // add refresh token to database
    user.refreshToken = newRefreshToken
    await user.save()

    // return the reponse and set new cookies
    return res.status(200).cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 3499
    }).cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json(new ApiResponse(200, {}, "New tokens generated"))
})

export { registerUser, verifyUser, resendVerificationCode, loginUser, logout, refreshAccessTokens }