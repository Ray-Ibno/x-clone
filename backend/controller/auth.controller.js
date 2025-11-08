import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req, res) => {
  const { username, fullName, password, email } = req.body
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const saltRounds = 10

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const userExists = await User.findOne({ username })
    if (userExists) {
      return res
        .status(400)
        .json({ error: true, message: 'username already exists' })
    }

    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res
        .status(400)
        .json({ error: true, message: 'email already exists' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: true, message: 'password must be 6 characters or more' })
    }

    const newUser = await User.create({
      username,
      fullName,
      password: hashedPassword,
      email,
    })

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()

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
  } catch (error) {
    console.log('Error at signup controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const isPasswordMatched = await bcrypt.compare(
      password,
      user?.password || ''
    )

    if (!user || !isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: 'invalid email or password' })
    }

    generateTokenAndSetCookie(user.id, res)

    res.status(200).json({
      username: user.username,
      fullName: user.fullName,
      password: user.password,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    })
  } catch (error) {
    console.log('Error at login controller', error.message)
    res.status(500).json({ error: 'Internal server error ' })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'successfully logged out' })
  } catch (error) {
    console.log('Error at logout controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    console.log('Error at getUser controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
