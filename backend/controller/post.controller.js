import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Notification from '../models/notification.model.js'
import { v2 as cloudinary } from 'cloudinary'

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate([
        { path: 'user', select: '-password' },
        { path: 'comments', populate: { path: 'user', select: '-password' } },
      ])
      .exec()
    res.status(200).json(posts)
  } catch (error) {
    console.log('Error at getAllPosts controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getLikedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'No user found' })
    const likedPosts = await Post.find({ likes: { $in: [user._id] } })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'user', select: '-password' },
        { path: 'comments', populate: { path: 'user', select: '-password' } },
      ])
      .exec()

    res.status(200).json(likedPosts)
  } catch (error) {
    console.log('Error at getLikedPosts controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getFollowingPosts = async (req, res) => {
  try {
    const followedUsers = await User.find({ followers: { $in: req.user.id } })
    if (!followedUsers) {
      return res.status(200).json([])
    }

    const followingPosts = await Post.find({ user: { $in: followedUsers } })
      .populate([
        { path: 'user', select: '-password' },
        { path: 'comments', populate: { path: 'user', select: '-password' } },
      ])
      .exec()

    res.status(200).json(!followingPosts ? [] : followingPosts)
  } catch (error) {
    console.log('Error at getFollowingPosts', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params
    const posts = await Post.find({ user: id })
      .sort({ createdAt: -1 })
      .populate(
        { path: 'user', select: '-password' },
        { path: 'comments', populate: { path: 'user', select: '-password' } }
      )
      .exec()

    res.status(200).json(posts)
  } catch (error) {
    console.log('Error at getUserPosts controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createPost = async (req, res) => {
  try {
    const { text } = req.body
    let { img } = req.body

    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) return res.json(404).json({ error: 'No user found' })

    if (!text) {
      return res.status(400).json({ error: 'Please provide text' })
    }

    if (img) {
      const cloudinaryImg = await cloudinary.uploader.upload(img)
      img = cloudinaryImg.secure_url
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    })

    await newPost.save()

    res.status(201).json(newPost)
  } catch (error) {
    console.log(`Error at createPost controller`, error.message)
    res.status(500).json('Internal server error')
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const postToDelete = await Post.findById(postId)

    if (!postToDelete) {
      return res.status(404).json({ error: 'No post found' })
    }

    if (postToDelete.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to delete this post' })
    }

    if (postToDelete.img) {
      const imgId = postToDelete.img.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(imgId)
    }

    await Post.findByIdAndDelete(postId)

    res.status(200).json({ message: 'Post was successfully deleted' })
  } catch (error) {
    console.log('Error at deletePost controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body
    const { id } = req.params
    const userId = req.user._id

    if (!text) {
      return res
        .status(400)
        .json({ error: 'Please input text on the text field' })
    }

    const post = await Post.findById(id)

    const comment = {
      text,
      user: userId,
    }

    post.comments.push(comment)
    await post.save()

    res.status(200).json(post)
  } catch (error) {
    console.log('Error at commentOnPost controller', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id
    const postId = req.params.id

    const post = await Post.findById(postId).exec()

    if (!post) {
      return res.status(404).json({ error: 'No post found' })
    }
    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      //Unlike
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
      )
      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      )

      res.status(200).json(updatedPost.likes)
    } else {
      //Like
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: userId } },
        { new: true }
      )
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { likedPosts: postId } }
      )

      const notification = new Notification({
        to: post.user,
        from: userId,
        type: 'like',
      })

      await notification.save()
      res.status(200).json(updatedPost.likes)
    }
  } catch (error) {
    console.log('Error at likePost controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
