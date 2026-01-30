import { v2 as cloudinary } from 'cloudinary'
import { Message, Chat } from '../models/message.model.js'
import User from '../models/user.model.js'
import { getReceiverSocketId, io } from '../listeners/socket.js'

export const getChats = async (req, res) => {
  const loggedInUserId = req.user.id
  try {
    const chats = await Chat.find({ members: { $in: [loggedInUserId] } })
      .populate('members')
      .populate('lastMessage')
    if (!chats) return res.status(200).json([])
    res.status(200).json(chats)
  } catch (error) {
    console.error(`Error at getMessageUsers controller: ${error.message}`)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMessages = async (req, res) => {
  const loggedInUserId = req.user.id
  const userToChatId = req.params.id

  try {
    const chat = await Chat.findOne({ members: { $all: [loggedInUserId, userToChatId] } })
    if (!chat) return res.status(200).json([])
    const messages = await Message.find({
      chat: chat._id,
    })
    if (!messages) res.status(200).json([])
    res.status(200).json(messages)
  } catch (error) {
    console.error(`Error at getMessages controller: ${error.message}`)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findOne({ _id: id })
    if (!user) return res.status(400).json({ message: 'No user found' })
    res.status(200).json(user)
  } catch (error) {
    console.error(`Error at getUser controller: ${error.message}`)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const sendMessage = async (req, res) => {
  const loggedInUserId = req.user.id
  const userToChatId = req.params.id
  const { text, image } = req.body

  let imageUrl

  try {
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

      return res.status(201).json({ newMessage, updatedChat })
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

    res.status(201).json({ newChat, newMessage })
  } catch (error) {
    console.error(`Error at sendMessage controller: ${error.message}`)
    res.status(500).json({ message: 'Internal server error' })
  }
}
