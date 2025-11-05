import express from 'express'
import User from '../models/user.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find({})

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Server Error' })
  }
})

router.get('/user/:id', async (req, res) => {})

router.delete('/user/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById({ _id: id })

    if (!user) {
      res.status(400).json({ success: false, message: 'No user found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'account successfully deleted' })
  } catch (error) {
    res.status(500).json({ error: 'internal server error' })
  }
})

export default router
