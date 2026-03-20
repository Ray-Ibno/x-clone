import * as postService from '../services/post.service.js'

export const getAllPosts = async (req, res) => {
  const posts = await postService.fetchPosts()
  res.status(200).json(posts)
}

export const getLikedPosts = async (req, res) => {
  const likedPosts = await postService.fetchLikedPosts(req.params.username)
  res.status(200).json(likedPosts)
}

export const getFollowingPosts = async (req, res) => {
  const followingPosts = await postService.fetchFollowingPosts(req.user.id)
  res.status(200).json(!followingPosts ? [] : followingPosts)
}

export const getUserPosts = async (req, res) => {
  const posts = await postService.fetchUserPosts(req.params.username)
  res.status(200).json(posts)
}

export const createPost = async (req, res) => {
  const newPost = await postService.post(req.body.text, req.body.img, req.user._id)
  res.status(201).json(newPost)
}

export const deletePost = async (req, res) => {
  await postService.removePost(req.params.id)
  res.status(200).json({ message: 'Post was successfully deleted' })
}

export const commentOnPost = async (req, res) => {
  const updatedPost = await postService.postComment(req.body.text, req.params.id, req.user._id)
  res.status(200).json(updatedPost.comments)
}

export const likeUnlikePost = async (req, res) => {
  const updatedPost = await postService.postReact(req.user._id, req.params.id)
  res.status(200).json(updatedPost.likes)
}
