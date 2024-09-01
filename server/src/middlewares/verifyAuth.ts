import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "../models/UserModel";
import asyncHandler from "../utils/asyncHandler";

export interface IRequest extends Request {
    user: any
}

export const verifyAuth = asyncHandler(async (req: Request, _: Response, next: any) => {
    const token = req.cookies?.access_token
    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }

    req.user = user;
    next();
})