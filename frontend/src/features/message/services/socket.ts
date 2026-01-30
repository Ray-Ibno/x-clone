import { io } from 'socket.io-client'
import { useChatStore } from '../store/useChatStore'

const BASE_URL = 'http://localhost:5100'

export const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true,
})

socket.on('getOnlineUsers', (users) => {
  useChatStore.getState().actions.setOnlineUsers(users)
})

socket.on('newMessage', (message) => {
  useChatStore.getState().actions.addMessage(message)
})

export const connectSocket = (userId: string) => {
  if (!socket.connected) {
    socket.auth = { userId }
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect()
}
