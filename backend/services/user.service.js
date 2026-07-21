import AppError from '../errors/AppError.js'
import bcrypt from 'bcryptjs'
import { userDB } from '../repositories/userDB.repository.js'
import { notificationDB } from '../repositories/notificationDB.repository.js'
import { cloudinaryUploader } from '../repositories/cloudinary.repository.js'
import { userCache } from '../repositories/userCache.repository.js'

export const fetchUserDetails = async (username) => {
  const key = `${username}:details`

  const cached = await safeAwait(userCache.getKey(key))
  if (cached) return cached

  const user = await userDB.findOne({ username })
  if (!user) throw new AppError('No user found', 404)

  safeAwait(userCache.setKey(key, user))

  return user
}

export const fetchSuggestedUsers = async (userId) => {
  const key = `suggested_users:${userId}`

  const cached = await safeAwait(userCache.getKey(key))
  if (cached) return cached

  const suggestedUsers = await userDB.findSuggestedUsers(userId, 5)

  safeAwait(userCache.setKey(key, suggestedUsers))

  return suggestedUsers
}

export const changeFollowStatus = async (targetUserId, currentUserId) => {
  if (currentUserId === targetUserId) {
    throw new AppError('You cannot follow or unfollow yourself', 404)
  }

  const { isFollowing, targetUser } = userDB.toggleFollow(currentUserId, targetUserId)

  if (!targetUser) throw new AppError('User not found', 404)
  if (isFollowing) safeAwait(notificationDB.newNotification('follow', currentUserId, targetUserId))

  safeAwait(userCache.deleteKey(`${userToFollowUnfollow.username}:details`))

  return { isFollowing, username: targetUser.username }
}

export const updateProfile = async (userId, bodyData) => {
  let profileImage = bodyData.profileImg
  let coverImage = bodyData.coverImg

  let userToUpdate = await userDB.findById(id)
  if (!userToUpdate) throw new AppError('No user found', 404)

  if (
    (!bodyData.currentPassword && bodyData.newPassword) ||
    (bodyData.currentPassword && !bodyData.newPassword)
  ) {
    throw new AppError('Please provide both current password and new password')
  }

  if (bodyData.currentPassword && bodyData.newPassword) {
    const isPasswordMatched = await bcrypt.compare(bodyData.currentPassword, userToUpdate.password)

    if (!isPasswordMatched) throw new AppError('Please provide the correct current password', 400)

    const salt = 10
    const hashedPassword = await bcrypt.hash(bodyData.newPassword, salt)

    userToUpdate.password = hashedPassword
  }

  if (profileImage) {
    if (userToUpdate.profileImg) {
      await cloudinaryUploader.destroy(userToUpdate.profileImg)
    }
    const response = await cloudinaryUploader.upload(profileImage)
    profileImage = response.secure_url
  }

  if (coverImage) {
    if (userToUpdate.coverImg) {
      await cloudinaryUploader.destroy(userToUpdate.coverImg)
    }
    const response = await cloudinaryUploader.upload(coverImage)
    coverImage = response.secure_url
  }

  userToUpdate.username = bodyData.username || userToUpdate.username
  userToUpdate.fullName = bodyData.fullName || userToUpdate.fullName
  userToUpdate.email = bodyData.email || userToUpdate.email
  userToUpdate.bio = bodyData.bio || userToUpdate.bio
  userToUpdate.link = bodyData.link || userToUpdate.link
  userToUpdate.profileImg = profileImage || userToUpdate.profileImg
  userToUpdate.coverImg = coverImage || userToUpdate.coverImg

  userToUpdate = await userToUpdate.save()

  userToUpdate.password = null //removed for the client response as a security mesure

  safeAwait(userCache.deleteKey(`${userId}:profile`))

  return userToUpdate
}
