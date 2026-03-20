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
  const message = await userService.changeFollowStatus(req.params.id, req.user._id)
  res.status(200).json(message)
}

export const updateUserProfile = async (req, res) => {
  const user = await userService.updateProfile(
    req.user.id,
    req.body.username,
    req.body.fullName,
    req.body.email,
    req.body.currentPassword,
    req.body.newPassword,
    req.body.bio,
    req.body.link,
    req.body.profileImg,
    req.body.coverImg,
  )

  res.status(200).json(user)
}
