import type { Message } from './message-model'
import type { User } from './user-model'

export type Chat = {
  _id: string
  members: User[]
  isGroupChat: boolean
  lastMessage: Message
  createdAt: string
}
