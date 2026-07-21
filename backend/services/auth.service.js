import AppError from '../errors/AppError.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js'
import { tokenCache } from '../repositories/tokenCache.repository.js'
import { tokenDB } from '../repositories/tokenDB.repository.js'
import { userDB } from '../repositories/userDB.repository.js'
import { userCache } from '../repositories/userCache.repository.js'

const SEVEN_DAYS = 604800

export const findUser = async (id) => {
  const key = `user-profile:${id}`
  const cached = await userCache.getUser(key)

  if (cached) return cached

  const user = await userDB.findById(id)
  if (!user) throw new AppError('No user found', 404)

  try {
    await userCache.setUser(key, user)
  } catch (error) {
    onsole.error('Cache syncronization failed: ', cacheError.message)
  }

  return user
}

export const register = async ({ username, fullName, email, password }) => {
  const saltRounds = 10

  const emailExists = await userDB.findOne({ email })
  if (emailExists) throw new AppError('Email already exists', 400)

  const userExists = await userDB.findOne({ username })
  if (userExists) throw new AppError('Username already exists', 400)

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const newUser = await userDB.create({
    username,
    fullName,
    password: hashedPassword,
    email,
  })

  const newAccessToken = generateAccessToken(newUser._id)
  const newRefreshToken = generateRefreshToken(newUser._id)

  const sessionKey = `x-clone-session:${newRefreshToken}`
  const trackerKey = `user:${newUser._id}:session:${newRefreshToken}`

  const sessionPayload = { user_id: newUser._id, loggedInAt: new Date() }

  try {
    await Promise.all([
      tokenCache.setSession(sessionKey, sessionPayload, SEVEN_DAYS),
      tokenCache.setSession(trackerKey, 'active', SEVEN_DAYS),
    ])
  } catch (cacheError) {
    console.error('Cache syncronization failed: ', cacheError.message)
  }

  const dbTokenExp = new Date(Date.now() + SEVEN_DAYS * 1000)
  await tokenDB.addDbToken(newUser._id, newRefreshToken, dbTokenExp)

  return { newUser, newAccessToken, newRefreshToken }
}

export const signIn = async ({ email, password }) => {
  const user = await userDB.findByEmail(email).select('+password')
  if (!user) throw new AppError('Invalid email', 400)

  const isPasswordMatched = await bcrypt.compare(password, user?.password || '')
  if (!isPasswordMatched) throw new AppError('Invalid password', 400)

  const newAccessToken = generateAccessToken(user._id)
  const newRefreshToken = generateRefreshToken(user._id)

  const sessionKey = `x-clone-session:${newRefreshToken}`
  const trackerKey = `user:${user._id}:session:${newRefreshToken}`

  const sessionPayload = { user_id: user._id, loggedInAt: new Date() }

  try {
    await Promise.all([
      tokenCache.setSession(sessionKey, sessionPayload, SEVEN_DAYS),
      tokenCache.setSession(trackerKey, 'active', SEVEN_DAYS),
    ])
  } catch (error) {
    console.error('Cache syncronization failed: ', cacheError.message)
  }

  const dbTokenExp = new Date(Date.now() + SEVEN_DAYS * 1000)
  await tokenDB.addDbToken(user._id, newRefreshToken, dbTokenExp)

  const userObj = user.toObject()
  delete userObj.password

  return { userObj, newAccessToken, newRefreshToken }
}

export const handleRefreshToken = async (refreshToken, res) => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

  const sessionKey = `x-clone-session:${refreshToken}`
  const trackerKey = `user:${decoded.userId}:session:${refreshToken}`

  const sessionExists = await tokenCache.getSession(sessionKey)

  if (!sessionExists) {
    console.error('Cache check failed. Checking token directly from the database...')
    const refreshTokenExists = await tokenDB.dbTokenCheck(decoded.userId, refreshToken)

    if (!refreshTokenExists) throw new AppError('Invalid session', 401)

    const isExpired = new Date() > refreshTokenExists.expiresAt

    if (isExpired) {
      await tokenDB.deleteDbToken(decoded.userId, refreshToken)
      throw new AppError('Session expired. Please login again', 401)
    }
  }

  const newAccessToken = generateAccessToken(decoded.userId)
  const newRefreshToken = generateRefreshToken(decoded.userId)

  try {
    const newSessionKey = `x-clone-session:${newRefreshToken}`
    const newTrackerKey = `user:${decoded.userId}:session:${newRefreshToken}`

    const sessionPayload = { user_id: decoded.userId, loggedInAt: new Date() }

    await Promise.all([
      tokenCache.deleteSession(sessionKey, trackerKey),
      tokenCache.setSession(newSessionKey, sessionPayload, decoded.exp),
      tokenCache.setSession(newTrackerKey, 'active', decoded.exp),
    ])
  } catch (error) {
    console.error('Cache syncronization failed: ', cacheError.message)
  }

  const result = await tokenDB.updateDbToken(decoded, refreshToken, newRefreshToken)
  if (result.modifiedCount === 0) {
    // This could indicate a Token Reuse Attack (hacker using an old token)
    throw new Error('Invalid refresh token or session expired.')
  }

  return { newAccessToken, newRefreshToken }
}

export const deleteTokenAndSession = async (userId, refreshToken) => {
  tokenDB.deleteDbToken(userId, refreshToken)

  try {
    const sessionKey = `x-clone-session:${refreshToken}`
    const trackerKey = `user:${userId}:session:${refreshToken}`

    await tokenCache.deleteSession(sessionKey, trackerKey)
  } catch (error) {
    console.error(
      `[CRITICAL SECURITY WARNING]: Failed to clear Redis cache on logout for user ${userId}. ` +
        `Session will remain active in cache until TTL expires. Error: ${cacheError.message}`,
    )
  }
}
