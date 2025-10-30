import express from 'express'
import dbConnect from './db/dbConnect.js'
import 'dotenv/config'
import authRoute from './routes/auth.route.js'

const app = express()
const PORT = process.env.PORT || 5200

app.use('/api', authRoute)

app.listen(PORT, () => {
  dbConnect()
  console.log(`listening to port ${PORT}`)
})
