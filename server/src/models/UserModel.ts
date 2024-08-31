import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface User {
    username: string,
    email: string,
    password: string,
    avatar?: string,
    refreshToken: string,
    OTP: string,
    OTPExpiry: Date,
    passwordResetToken: string,
    passwordResetTokenExpiry: Date
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    refreshToken: String,
    OTP: String,
    OTPExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date
},
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

export const User = model<User>('User', userSchema)