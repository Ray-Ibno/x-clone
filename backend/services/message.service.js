import AppError from '../errors/AppError.js'
import { getReceiverSocketId, io } from '../listeners/socket.js'
import { Chat, Message } from '../models/message.model.js'
import User from '../models/user.model.js'

import cloudinary from '../config/cloudinary.js'

export const getChats = async (loggedInUserId) => {
  const chats = await Chat.find({ members: { $in: [loggedInUserId] } })
    .populate('members')
    .populate('lastMessage')

  if (!chats) return [] //return an empty array instead of null
  return chats
}

export const getConversation = async (loggedInUserId, userToChatId) => {
  const chat = await Chat.findOne({ members: { $all: [loggedInUserId, userToChatId] } })
  if (!chat) return []

  const messages = await Message.find({
    chat: chat._id,
  })
  if (!messages) return []

  return messages
}

export const getUser = async (id) => {
  const user = await User.findOne({ _id: id })
  if (!user) throw new AppError('No user found', 400)

  return user
}

export const postMessage = async (loggedInUserId, userToChatId, text, image) => {
  let imageUrl

  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image)
    imageUrl = uploadResponse.secure_url
  }

  const chatExists = await Chat.findOne({ members: { $all: [loggedInUserId, userToChatId] } })

  if (chatExists) {
    const message = new Message()

    message.sender = loggedInUserId
    message.chat = chatExists._id
    if (text) message.text = text
    if (image) message.image = image

    chatExists.lastMessage = message._id

    const updatedChat = await chatExists.save()
    const newMessage = await message.save()

    const receiverSocketId = getReceiverSocketId(userToChatId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    return { newMessage, updatedChat }
  }

  const chat = new Chat()
  const message = new Message()

  message.sender = loggedInUserId
  message.chat = chat._id
  if (text) message.text = text
  if (image) message.image = imageUrl

  chat.members = [loggedInUserId, userToChatId]
  chat.lastMessage = message._id

  const newMessage = await message.save()
  const newChat = await chat.save()

  const receiverSocketId = getReceiverSocketId(userToChatId)
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage)
  }

  return { newChat, newMessage }
}
