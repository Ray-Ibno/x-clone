import * as userService from '../services/user.service.js'

export const getUser = async (req, res) => {
  const user = await userService.fetchUserDetails(req.params.username)
  res.status(200).json(user)
}

export const getSuggestedUsers = async (req, res) => {
  const suggestedUsers = await userService.fetchSuggestedUsers(req.user._id)
  res.status(200).json(suggestedUsers)
}

export const followUnfollow = async (req, res) => {
  const { isFollowing, username } = await userService.changeFollowStatus(
    req.params.id,
    req.user._id,
  )
  res.status(200).json({ message: `You ${isFollowing ? 'followed' : 'unfollowed'} ${username}` })
}

export const updateUserProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body)
  res.status(200).json(user)
}
