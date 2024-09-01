import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface User {
    fullName: string,
    email: string,
    password: string,
    avatar?: string,
    isVerified: boolean,
    refreshToken: string,
    verificationCode: string | undefined,
    verificationCodeExpiry: Date | undefined,
    passwordResetToken: string | undefined,
    passwordResetTokenExpiry: Date | undefined
}

const userSchema = new Schema<User>({
    fullName: {
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
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    verificationCode: String,
    verificationCodeExpiry: Date,
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