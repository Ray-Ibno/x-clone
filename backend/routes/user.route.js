import express from 'express'
import { authenticateUser } from '../middleware/authorizeUser.js'
import {
  getUser,
  followUnfollow,
  updateUserProfile,
  getSuggestedUsers,
} from '../controller/users.controller.js'
import { validate } from '../middleware/validate.js'
import { updateProfileSchema } from '../validation/user.validation.js'

const router = express.Router()

router.get('/profile/:username', authenticateUser, getUser)
router.get('/suggested', authenticateUser, getSuggestedUsers)
router.post('/follow/:id', authenticateUser, followUnfollow)
router.post('/update', authenticateUser, validate(updateProfileSchema), updateUserProfile)

export default router
