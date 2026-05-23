import crypto from 'crypto'
import helmet from 'helmet'

const generateNonce = (req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64')
  next()
}

const cspConfiguration = (req, res, next) => {
  helmet.contentSecurityPolicy({
    directives: {
      objectSrc: ["'none'"],
      scriptSrc: [
        (req, res) => `'nonce-${res.locals.nonce}'`,
        "'strict-dynamic'",
        "'unsafe-inline'",
        'https:',
        'http',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      mediaSrc: ["'self'", 'https://res.cloudinary.com'],
      connectSrc: [
        "'self'",
        'https://x-clone-5xkt.onrender.com', // Allows HTTP polling requests
        'wss://x-clone-5xkt.onrender.com', // Allows native WebSocket connections
      ],
      baseUri: ["'none'"],
    },
  })(req, res, next)
}

export default [generateNonce, cspConfiguration]
