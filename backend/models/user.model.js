import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

userSchema.statics.findSuggestedUsers = async function (userId, limit) {
  try {
    const currentUser = await this.findById(userId)
    if (!currentUser) {
      throw new Error('User not found')
    }

    const usersToExclude = [userId, ...currentUser.following]

    const suggestedUsers = await this.aggregate([
      {
        $match: {
          _id: { $nin: usersToExclude },
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          profileImg: 1,
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ])
    return suggestedUsers
  } catch (error) {
    console.log('Error at finding suggested users', error.message)
    throw error
  }
}

const User = mongoose.model('User', userSchema)

export default User
