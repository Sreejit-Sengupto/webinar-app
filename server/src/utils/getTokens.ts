import jwt from 'jsonwebtoken'

const generateAccessToken = (userId: string, email: string, username: string) => {    
    return jwt.sign(
        {
            _id: userId,
            email,
            username
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "3499s"
        }
    )
}

const generateRefreshToken = (userId: string, email: string, username: string) => {
    return jwt.sign(
        {
            _id: userId,
            email,
            username
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d"
        }
    )
}

export { generateAccessToken, generateRefreshToken }