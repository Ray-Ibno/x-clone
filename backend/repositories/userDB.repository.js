import mongoose from 'mongoose'
import User from '../models/user.model.js'

export const userDB = {
  findById(id) {
    return User.findById(id)
  },
  findOne(prop) {
    return User.findOne(prop)
  },
  findByEmail(email) {
    return User.findOne({ email })
  },
  create(data) {
    return User.create(data)
  },
  findSuggestedUsers(userId, count) {
    return User.findSuggestedUsers(userId, count)
  },
  async unfollow(userId, targetUserId) {
    await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } })
    return User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } })
  },
  async follow(userId, targetUserId) {
    await User.findByIdAndUpdate(userId, { $push: { following: targetUserId } })
    return User.findByIdAndUpdate(targetUserId, { $push: { followers: userId } })
  },
  async toggleFollow(userId, targetUserId) {
    const targetUserObjId = new mongoose.Types.ObjectId(targetUserId) // Pipeline can't process string Id

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, [
      {
        $set: {
          following: {
            $cond: {
              if: { $in: [targetUserObjId, '$following'] },
              then: {
                $filter: { input: '$following', cond: { $ne: ['$$this', targetUserObjId] } },
              },
              else: { $concatArrays: ['$following', [targetUserObjId]] },
            },
          },
        },
      },
    ])

    if (!updatedUser) return { isFollowing: false, targetUser: null }

    const wasFollowing = updatedUser.following.map((id) => id.toString()).includes(targetUserId)
    const isFollowing = !wasFollowing

    const targetUser = await User.findOneAndUpdate(
      { _id: targetUserId },
      isFollowing ? { $addToSet: { followers: userId } } : { $pull: { followers: userId } },
      { new: true, select: 'username' },
    )

    return { isFollowing, targetUser }
  },
}
