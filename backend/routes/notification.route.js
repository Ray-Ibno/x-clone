import express from 'express'
import { authenticateUser } from '../middleware/authorizeUser.js'
import {
  deleteNotification,
  getNotifications,
} from '../controller/notification.controller.js'

const router = express.Router()

router.get('/', authenticateUser, getNotifications)
router.delete('/', authenticateUser, deleteNotification)

export default router
