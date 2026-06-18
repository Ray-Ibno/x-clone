import AppError from '../errors/AppError.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) throw new AppError('No token found', 401)

  const accessToken = authHeader.split(' ')[1]

  try {
    const verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(verifiedToken.userId).select('-password')
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired. Please log in again.', 401)
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Access denied.', 401)
    }

    throw new AppError('Authentication failed.', 401)
  }
}
