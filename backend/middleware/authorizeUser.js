import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      res.status(401).json({ error: 'no token found' })
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!verifiedToken) {
      res.status(401).json({ error: 'you are not authenticated' })
    }

    const user = await User.findById(verifiedToken.userId).select('-password')
    req.user = user
    next()
  } catch (error) {
    console.log('Error at authenticateUser middleware', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
