import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

import dbConnect from './db/dbConnect.js'
import { server } from './listeners/socket.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const PORT = process.env.PORT || 5200

server.listen(PORT, () => {
  dbConnect()
  console.log(`listening to port ${PORT}`)
})
