import express from 'express'
import {
  getUser,
  login,
  logout,
  signup,
} from '../controller/auth.controller.js'
import { authenticateUser } from '../middleware/authorizeUser.js'

const router = express.Router()

router.get('/user', authenticateUser, getUser)
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router
