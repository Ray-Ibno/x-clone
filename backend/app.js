const app = express()
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import fs from 'fs'

import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import messageRoute from './routes/message.route.js'

import { globalErrorHandler } from './middleware/globalErrorHandler.js'
import securityMiddleware from './middleware/security.js'

const __dirname = path.resolve()

app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())
app.use(securityMiddleware)

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/notifications', notificationRoute)
app.use('/api/messages', messageRoute)

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, 'frontend', 'dist')

  // Serve the compiled frontend assets folder
  app.use(express.static(distPath, { index: false }))

  // EXPRESS 5 FIX: Explicitly name the wildcard parameter using {*splat}
  app.get('/{*splat}', (req, res) => {
    const indexPath = path.resolve(distPath, 'index.html')

    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
      if (err) {
        console.error('Path Error: Cannot find your frontend file at:', indexPath)
        return res.status(500).send('Error loading frontend bundle.')
      }

      // Inject your cryptographic nonce token into the build HTML stream
      const securedHtml = htmlData.replace(/__CSP_NONCE__/g, res.locals.nonce)
      res.send(securedHtml)
    })
  })
}

app.use(globalErrorHandler)

export default app
