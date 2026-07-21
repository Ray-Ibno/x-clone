export const globalErrorHandler = (err, req, res, next) => {
  console.error(`Error:`, err.stack)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // 2. Intercept specific JWT Expiration Errors
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Your session has expired. Please log in again.'
  }

  // 3. Intercept Malformed, Tampered, or Invalid JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token. Authorization denied.'
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  })
}
