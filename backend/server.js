import express from 'express'
import dbConnect from './db/dbConnect.js'
import 'dotenv/config'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || 5200
app.use(express.json())
app.use(cookieParser())
app.use('/api', authRoute)
app.use('/users', userRoute)

app.listen(PORT, () => {
  dbConnect()
  console.log(`listening to port ${PORT}`)
})
