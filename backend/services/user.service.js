import AppError from '../errors/AppError.js'
import Notification from '../models/notification.model.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'

export const fetchUserDetails = async (username) => {
  const user = await User.findOne({ username }).select('-password')
  if (!user) throw new AppError('No user found', 404)

  return user
}

export const fetchSuggestedUsers = async (userId) => {
  const suggestedUsers = await User.findSuggestedUsers(userId, 5)
  return suggestedUsers
}

export const changeFollowStatus = async (targetUserId, currentUserId) => {
  if (currentUserId === targetUserId)
    throw new AppError('You cannot follow or unfollow yourself', 404)

  const userToFollowUnfollow = await User.findById(targetUserId)
  const currentUser = await User.findById(currentUserId)

  if (!currentUser || !userToFollowUnfollow) throw new AppError('User not found', 404)

  if (currentUser.following.includes(id)) {
    //unfollow
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } })
    await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } })
    return { message: `you unfollowed ${userToFollowUnfollow.username}` }
  } else {
    //follow
    await User.findByIdAndUpdate(currentUserId, { $push: { following: id } })
    await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } })

    const notification = new Notification({
      to: userToFollowUnfollow._id,
      from: currentUser._id,
      type: 'follow',
    })

    await notification.save()

    return { message: `you followed ${userToFollowUnfollow.username}` }
  }
}

export const updateProfile = async (
  userId,
  username,
  fullName,
  email,
  currentPassword,
  newPassword,
  bio,
  link,
  profileImg,
  coverImg,
) => {
  let profileImage = profileImg
  let coverImage = coverImg

  let user = await User.findById(userId)
  if (!user) throw new AppError('No user found', 404)

  if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
    throw new AppError('Please provide both current password and new password')
  }

  if (currentPassword && newPassword) {
    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordMatched) throw new AppError('Please provide the correct current password', 400)

    const salt = 10
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
  }

  if (profileImage) {
    if (user.profileImg) {
      await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
    }
    const response = await cloudinary.uploader.upload(profileImage)
    profileImage = response.secure_url
  }

  if (coverImage) {
    if (user.coverImg) {
      await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
    }
    const response = await cloudinary.uploader.upload(coverImage)
    coverImage = response.secure_url
  }

  user.username = username || user.username
  user.fullName = fullName || user.fullName
  user.email = email || user.email
  user.bio = bio || user.bio
  user.link = link || user.link
  user.profileImg = profileImage || user.profileImg
  user.coverImg = coverImage || user.coverImg

  user = await user.save()

  user.password = null //removed for the client response as a security mesure
  return user
}
