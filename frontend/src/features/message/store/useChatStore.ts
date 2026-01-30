import { create } from 'zustand'
import type { User } from '../../../types/user-model'
import type { Message } from '../../../types/message-model'
import type { Chat } from '../../../types/chat-model'

const MAX_MESSAGES = 50 // Only display 50 recent messages TODO: load older messages

type ChatStore = {
  messages: Message[]
  chats: Chat[] | null
  onlineUsers: User['_id'][]
  selectedUser: User | null
  userFromProfilePage: User | null

  isChatLoading: boolean
  isMessageLoading: boolean
  actions: {
    getMessages: (userToChatId: string) => Promise<void>
    getChats: () => Promise<void>
    sendMessage: (
      userToChatId: string,
      message: { text: string | null; image: string | null },
    ) => Promise<void>
    getUserFromProfilePage: (id: string) => Promise<void>
    addMessage: (newMessage: Message) => void

    setSelectedUser: (arg: User | null) => void
    setOnlineUsers: (arg: User['_id'][]) => void

    reset: () => void
  }
}

export const useChatStore = create<ChatStore>((set, get, store) => ({
  messages: [],
  chats: null,
  onlineUsers: [],
  selectedUser: null,
  userFromProfilePage: null,

  isChatLoading: false,
  isMessageLoading: false,
  actions: {
    getMessages: async (userToChatId) => {
      set({ isMessageLoading: true })
      try {
        const response = await fetch(`/api/messages/${userToChatId}`)
        const messages = (await response.json()) as Message[]
        set({ messages })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('An unknown error occured')
        }
      } finally {
        set({ isMessageLoading: false })
      }
    },
    getChats: async () => {
      set({ isChatLoading: true })
      try {
        const response = await fetch('/api/messages/chats')
        const chats = await response.json()

        set({ chats })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('An unknown error occured')
        }
      } finally {
        set({ isChatLoading: false })
      }
    },
    sendMessage: async (userToChatId, message) => {
      const { messages } = get()
      try {
        const response = await fetch(`/api/messages/send/${userToChatId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        })

        const data = await response.json()

        if (response.ok) {
          set({ messages: [...messages, data.newMessage].slice(-MAX_MESSAGES) })
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    getUserFromProfilePage: async (id) => {
      try {
        const response = await fetch(`/api/messages/user/${id}`)
        const user = await response.json()
        set({ userFromProfilePage: user })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('An unknown error occured')
        }
      }
    },
    addMessage: (newMessage) => {
      if (newMessage.sender !== store.getState().selectedUser?._id) return
      set((state) => ({ messages: [...state.messages, newMessage] }))
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
    reset: () => {
      set(store.getInitialState())
    },
    setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  },
}))

export const useChatActions = () => useChatStore((state) => state.actions)
