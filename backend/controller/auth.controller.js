import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js'
import * as authService from '../services/auth.service.js'
import AppError from '../errors/AppError.js'
import redis from '../config/redis.js'

export const getUser = async (req, res) => {
  const user = await authService.findUser(req.user._id)
  res.status(200).json(user)
}

export const signup = async (req, res) => {
  const { newUser, newAccessToken, newRefreshToken } = await authService.register(req.body)

  res.cookie('jwt', newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  })

  res.status(201).json({ accessToken: newAccessToken, ...newUser })
}

export const login = async (req, res) => {
  const { userObj, newAccessToken, newRefreshToken } = await authService.signIn(req.body)

  res.cookie('jwt', newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  })

  res.status(200).json({ accessToken: newAccessToken, ...userObj })
}

export const logout = async (req, res) => {
  if (!req.cookies || !req.cookies.jwt) throw new AppError('No jwt cookies found', 401)
  if (!req.user || !req.user._id) throw new AppError('No user id found', 401)

  const userId = req.user._id
  const refreshToken = req.cookies.jwt

  await authService.deleteTokenAndSession(userId, refreshToken)

  res.cookie('jwt', '', { maxAge: 0 })
  res.status(200).json({ message: 'successfully logged out' })
}

export const refresh = async (req, res) => {
  if (!req.cookies || !req.cookies.jwt) throw new AppError('No jwt cookies found', 401)

  const refreshToken = req.cookies.jwt
  const { newAccessToken, newRefreshToken } = await authService.handleRefreshToken(refreshToken)

  res.cookie('jwt', newRefreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  })

  res.status(200).json({ accessToken: newAccessToken })
}
