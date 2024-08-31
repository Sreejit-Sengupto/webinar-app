import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/UserModel";
import { generateAvatar } from "../utils/generateAvatar";
import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/getTokens";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    const avatarUrl = generateAvatar(email)

    const createdUser = await User.create({
        avatar: avatarUrl,
        username,
        email,
        password,
    })

    // TODO: Send OTP and set tokens

    const accessToken = generateAccessToken(createdUser._id.toString(), createdUser.email, createdUser.username)
    const refreshToken = generateRefreshToken(createdUser._id.toString(), createdUser.email, createdUser.username)

    createdUser.refreshToken = refreshToken;
    await createdUser.save()

    const user = await User.findById(createdUser._id).select("-password")

    return res.status(200).cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 3499
    }).cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json(new ApiResponse(200, { user }, "User registered successfully!"))
})

export { registerUser }