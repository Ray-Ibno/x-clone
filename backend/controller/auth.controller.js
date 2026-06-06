import { generateAccessToken, generateRefreshToken, jwt } from '../utils/generateTokens.js'
import * as authService from '../services/auth.service.js'
import AppError from '../errors/AppError.js'
import redis from '../config/redis.js'

export const signup = async (req, res) => {
  const newUser = await authService.register(
    req.body.username,
    req.body.fullName,
    req.body.email,
    req.body.password,
  )

  const accessToken = generateAccessToken(newUser._id, res)
  await generateRefreshToken(newUser._id, res)

  res.status(201).json({
    accessToken,
    username: newUser.username,
    fullName: newUser.fullName,
    password: newUser.password,
    email: newUser.email,
    followers: newUser.followers,
    following: newUser.following,
    profileImg: newUser.profileImg,
    coverImg: newUser.coverImg,
    bio: newUser.bio,
    link: newUser.link,
  })
}

export const login = async (req, res) => {
  const user = await authService.signIn(req.body.email, req.body.password)

  const accessToken = generateAccessToken(user.id, res)
  await generateRefreshToken(user.id, res)

  res.status(200).json({
    accessToken,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
    bio: user.bio,
    link: user.link,
  })
}

export const logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.status(200).json({ message: 'successfully logged out' })
}

export const getUser = async (req, res) => {
  const user = await authService.findUser(req.user._id)
  res.status(200).json(user)
}

export const refresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) throw new AppError('No jwt cookies found', 401)
  const refreshToken = cookies.jwt

  const storedRefreshToken = await redis.get('x-clone-jwt')
  if (refreshToken !== storedRefreshToken) throw new AppError('Expired token', 403)

  const verifiedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  if (!verifiedRefreshToken) throw new AppError('Invalid token', 403)

  const accessToken = generateAccessToken(verifiedRefreshToken.userId, res)
  res.json({ accessToken })
}
