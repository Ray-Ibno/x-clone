import AppError from '../errors/AppError.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) throw new AppError('No token found', 401)

  const accessToken = authHeader.split(' ')[1]

  const verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
  if (!verifiedToken) throw new AppError('You are not authenticated', 401)

  const user = await User.findById(verifiedToken.userId).select('-password')
  req.user = user
  next()
}
