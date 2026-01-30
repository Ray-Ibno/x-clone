import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import Notification from '../models/notification.model.js'

export const getUser = async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'No user found' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.log('Error at getUser controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.findSuggestedUsers(req.user._id, 5)
    res.status(200).json(suggestedUsers)
  } catch (error) {
    console.log('Error at getSuggestedUsers controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const followUnfollow = async (req, res) => {
  const { id } = req.params
  const currentUserId = req.user._id

  try {
    const userToFollowUnfollow = await User.findById(id)
    const currentUser = await User.findById(currentUserId)

    if (id === req.params._id) {
      return res.status(404).json({ error: 'You cannot follow or unfollow yourself' })
    }

    if (!currentUser || !userToFollowUnfollow) {
      return res.status(404).json({ error: 'user not found' })
    }

    if (currentUser.following.includes(id)) {
      //unfollow
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } })
      await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } })
      res.status(200).json({ message: `you unfollowed ${userToFollowUnfollow.username}` })
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

      res.status(200).json({ message: `you followed ${userToFollowUnfollow.username}` })
    }
  } catch (error) {
    console.log('Error at followUnfollow controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateUserProfile = async (req, res) => {
  const { username, fullName, email, currentPassword, newPassword, bio, link } = req.body
  let { profileImg, coverImg } = req.body

  const userId = req.user._id

  try {
    let user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'no user found' })
    }

    if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
      return res.status(400).json({
        error: 'please provide both current password and new password',
      })
    }

    if (currentPassword && newPassword) {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      const isPasswordStrong = passwordRegex.test(newPassword)

      const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)

      if (!isPasswordMatched) {
        return res.status(400).json({ error: 'Please provide the correct current password' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password needs to be 6 characters or more' })
      }

      if (!isPasswordStrong) {
        return res.status(400).json({
          message:
            'Password needs atleast one number, one lowercase letter and one uppercase letter',
        })
      }

      const salt = 10
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      user.password = hashedPassword
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const isEmailValid = emailRegex.test(email)
      if (!isEmailValid) return res.status(400).json({ message: 'email is not in valid format' })
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
      }
      const response = await cloudinary.uploader.upload(profileImg)
      profileImg = response.secure_url
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
      }
      const response = await cloudinary.uploader.upload(coverImg)
      coverImg = response.secure_url
    }

    user.username = username || user.username
    user.fullName = fullName || user.fullName
    user.email = email || user.email
    user.bio = bio || user.bio
    user.link = link || user.link
    user.profileImg = profileImg || user.profileImg
    user.coverImg = coverImg || user.coverImg

    user = await user.save()

    user.password = null //removed for the client response as a security mesure
    return res.status(200).json(user)
  } catch (error) {
    console.log('Error at updateUserProfile controller', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
