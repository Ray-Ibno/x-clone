import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
)

// Define the virtual property to extract the Public ID dynamically
postSchema.virtual('imgPublicId').get(function () {
  if (!this.img) return null

  const parts = this.img.split('/')
  const uploadIndex = parts.indexOf('upload')
  if (uploadIndex === -1) return null

  // Isolate everything after '/upload/'
  let remainingParts = parts.slice(uploadIndex + 1)

  // If a version tag (e.g., 'v1625000000') is present, remove it
  if (remainingParts[0].startsWith('v') && !isNaN(remainingParts[0].substring(1))) {
    remainingParts.shift()
  }

  // Join back together and drop the file extension (e.g., '.jpg')
  const fullPublicId = remainingParts.join('/')
  return fullPublicId.substring(0, fullPublicId.lastIndexOf('.'))
})

const Post = mongoose.model('Post', postSchema)

export default Post
