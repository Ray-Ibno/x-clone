import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat',
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    readBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    chatName: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
)

export const Message = mongoose.model('Message', messageSchema)
export const Chat = mongoose.model('Chat', chatSchema)
