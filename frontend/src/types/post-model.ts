import type { User } from './user-model'

export type POST = {
  _id: string
  text: string
  img?: string
  user: User
  comments: { _id: string; text: string; user: User }[]
  likes: string[]
  createdAt: string
}
