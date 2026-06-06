import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'

const generateAccessToken = (userId, res) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })
  return accessToken
}

const generateRefreshToken = async (userId, res) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  })

  await redis.set('x-clone-jwt', refreshToken)

  res.cookie('jwt', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  })
}

export { generateAccessToken, generateRefreshToken, jwt }
