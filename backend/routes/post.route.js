import express from 'express'
import {
  createPost,
  likeUnlikePost,
  deletePost,
  commentOnPost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
} from '../controller/post.controller.js'
import { authenticateUser } from '../middleware/authorizeUser.js'

const router = express.Router()

router.get('/all', authenticateUser, getAllPosts)
router.get('/liked/:id', authenticateUser, getLikedPosts)
router.get('/following', authenticateUser, getFollowingPosts)
router.get('/user/:id', authenticateUser, getUserPosts)
router.post('/create', authenticateUser, createPost)
router.post('/like/:id', authenticateUser, likeUnlikePost)
router.delete('/delete/:id', authenticateUser, deletePost)
router.post('/comment/:id', authenticateUser, commentOnPost)

export default router
