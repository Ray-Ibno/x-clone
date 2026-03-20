import AppError from '../errors/AppError.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const register = async (username, fullName, email, password) => {
  const saltRounds = 10

  const emailExists = await User.findOne({ email })
  if (emailExists) throw new AppError('Email already exists', 400)

  const userExists = await User.findOne({ username })
  if (userExists) throw new AppError('Username already exists', 400)

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const newUser = await User.create({
    username,
    fullName,
    password: hashedPassword,
    email,
  })

  return newUser
}

export const signIn = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new AppError('Invalid email', 400)

  const isPasswordMatched = await bcrypt.compare(password, user?.password || '')
  if (!isPasswordMatched) throw new AppError('Invalid password', 400)

  return user
}

export const findUser = async (id) => {
  const user = await User.findById(id).select('-password')
  return user
}
