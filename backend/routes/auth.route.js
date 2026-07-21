import express from 'express'
import { getUser, login, logout, signup, refresh } from '../controller/auth.controller.js'
import { authenticateUser } from '../middleware/authorizeUser.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, signupSchema } from '../validation/auth.validation.js'

const router = express.Router()

router.get('/user', authenticateUser, getUser)
router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticateUser, logout)
router.post('/refresh', refresh)

export default router
