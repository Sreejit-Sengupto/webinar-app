import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/dist')))


import userRouter from './routes/userRoutes'
app.use('/api/v1/user', userRouter)

export { app }