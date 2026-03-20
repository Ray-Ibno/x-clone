import * as messageService from '../services/message.service.js'

export const getChats = async (req, res) => {
  const chats = await messageService.getChats(req.user.id)
  res.status(200).json(chats)
}

export const getMessages = async (req, res) => {
  const conversation = await messageService.getConversation(req.user.id, req.params.id)
  res.status(200).json(conversation)
}

export const getUser = async (req, res) => {
  const user = await messageService.getUser(req.params.id)
  res.status(200).json(user)
}

export const sendMessage = async (req, res) => {
  const newConversation = await messageService.postMessage(
    req.user.id,
    req.params.id,
    req.body.text,
    req.body.image,
  )
  res.status(201).json(newConversation)
}
