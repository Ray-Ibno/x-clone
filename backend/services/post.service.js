import AppError from '../errors/AppError.js'
import Notification from '../models/notification.model.js'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'

import cloudinary from '../config/cloudinary.js'

export const fetchPosts = async () => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate([
      { path: 'user', select: '-password' },
      { path: 'comments', populate: { path: 'user', select: '-password' } },
    ])
    .exec()

  return posts
}

export const fetchLikedPosts = async (username) => {
  const user = await User.findOne({ username })
  if (!user) throw new AppError('No user found', 404)

  const likedPosts = await Post.find({ likes: { $in: [user._id] } })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'user', select: '-password' },
      { path: 'comments', populate: { path: 'user', select: '-password' } },
    ])
    .exec()

  return likedPosts
}

export const fetchFollowingPosts = async (userId) => {
  const followedUsers = await User.find({ followers: { $in: userId } })
  if (!followedUsers) return []

  const followingPosts = await Post.find({ user: { $in: followedUsers } })
    .populate([
      { path: 'user', select: '-password' },
      { path: 'comments', populate: { path: 'user', select: '-password' } },
    ])
    .exec()

  return followingPosts
}

export const fetchUserPosts = async (username) => {
  const user = await User.findOne({ username })
  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'user', select: '-password' },
      { path: 'comments', populate: { path: 'user', select: '-password' } },
    ])
    .exec()

  return posts
}

export const post = async (text, image, userId) => {
  let img = image

  const user = await User.findById(userId)

  if (!user) throw new AppError('No user found', 404)
  if (!text) throw new AppError('Please provide text', 400)

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

  return newPost
}

export const removePost = async (postId, userId) => {
  const postToDelete = await Post.findById(postId)
  if (!postToDelete) throw new AppError('No post found', 404)

  if (postToDelete.user.toString() !== userId.toString()) {
    throw new AppError('You are not authorized', 401)
  }

  if (postToDelete.img) {
    const imgId = postToDelete.img.split('/').pop().split('.')[0]
    await cloudinary.uploader.destroy(imgId)
  }

  await Post.findByIdAndDelete(postId)
}

export const postComment = async (text, postId, userId) => {
  if (!text) throw new AppError('Please input text on the text field', 400)

  const comment = {
    text,
    user: userId,
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { $push: { comments: comment } },
    { new: true },
  ).populate([
    { path: 'user', select: '-password' },
    { path: 'comments', populate: { path: 'user', select: '-password' } },
  ])

  return updatedPost
}

export const postReact = async (userId, postId) => {
  const post = await Post.findById(postId).exec()

  if (!post) throw new AppError('No post found', 404)
  const isLiked = post.likes.includes(userId)

  if (isLiked) {
    //Unlike
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } },
      { new: true },
    )
    await User.findOneAndUpdate({ _id: userId }, { $pull: { likedPosts: postId } })

    return updatedPost
  } else {
    //Like
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: userId } },
      { new: true },
    )
    await User.findOneAndUpdate({ _id: userId }, { $push: { likedPosts: postId } })

    const notification = new Notification({
      to: post.user,
      from: userId,
      type: 'like',
    })

    await notification.save()
    return updatedPost
  }
}
