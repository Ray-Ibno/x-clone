import express from 'express'
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'

import dbConnect from './db/dbConnect.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const app = express()
const PORT = process.env.PORT || 5200

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () => {
  dbConnect()
  console.log(`listening to port ${PORT}`)
})
