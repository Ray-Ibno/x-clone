import express from 'express'
import { getChats, getMessages, sendMessage, getUser } from '../controller/message.controller.js'
import { authenticateUser } from '../middleware/authorizeUser.js'

const router = express.Router()

router.get('/chats', authenticateUser, getChats)
router.get('/:id', authenticateUser, getMessages)
router.get('/user/:id', authenticateUser, getUser)

router.post('/send/:id', authenticateUser, sendMessage)

export default router
