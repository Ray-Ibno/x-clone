import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'
import User from '../models/user.model.js'

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })
  return accessToken
}

const generateRefreshToken = (userId) => {
  const key = `x-clone-session:${userId}`

  const newRefreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  })

  return newRefreshToken
}

export { generateAccessToken, generateRefreshToken }
