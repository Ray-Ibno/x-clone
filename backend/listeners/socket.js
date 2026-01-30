import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const getReceiverSocketId = (userId) => {
  return userSocketMap[userId]
}

const userSocketMap = {} //store online user : {userId: socketId}

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId
  if (userId) userSocketMap[userId] = socket.id

  // sends online users to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, app, server, getReceiverSocketId }
