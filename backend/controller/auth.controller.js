import generateTokenAndSetCookie from '../utils/generateToken.js'
import * as authService from '../services/auth.service.js'

export const signup = async (req, res) => {
  const newUser = await authService.register(
    req.body.username,
    req.body.fullName,
    req.body.email,
    req.body.password,
  )

  generateTokenAndSetCookie(newUser._id, res)

  res.status(201).json({
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

  generateTokenAndSetCookie(user.id, res)

  res.status(200).json({
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
