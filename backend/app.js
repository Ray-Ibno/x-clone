const app = express()
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import messageRoute from './routes/message.route.js'

import { globalErrorHandler } from './middleware/globalErrorHandler.js'

const __dirname = path.resolve()

app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/notifications', notificationRoute)
app.use('/api/messages', messageRoute)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('/*path', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

app.use(globalErrorHandler)

export default app
