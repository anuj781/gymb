import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { createServer } from 'http'
import { Server } from 'socket.io'

import connectDB from './config/db.js'

/* ROUTES */
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import goalRoutes from './routes/goalRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import trainerRoutes from './routes/trainerRoutes.js'
import programRoutes from './routes/programRoutes.js'
import pricingRoutes from './routes/pricingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import privateChatRoutes from './routes/privateChatRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

/* MODELS */
import Message from './models/Message.js'
import Conversation from './models/Conversation.js'
import PrivateMessage from './models/PrivateMessage.js'

dotenv.config()

connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(
        new Error('CORS Not Allowed')
      )
    },
    credentials: true,
  })
)

app.use(
  express.json({
    limit: '50mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
)

/* API ROUTES */

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/trainers', trainerRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/private-chat', privateChatRoutes)
app.use('/api/payment', paymentRoutes)

/* TEST ROUTE */

app.get('/', (req, res) => {
  res.send('🚀 Gym API Running Successfully')
})

/* SOCKET SERVER */

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('✅ User Connected:', socket.id)

  socket.on('send_message', async (data) => {
    try {
      if (!data.user || !data.text) return

      const newMessage = await Message.create({
        user: data.user,
        name: data.name,
        profileImage: data.profileImage,
        text: data.text,
        type: data.type || 'text',
        imageUrl: data.imageUrl || '',
      })

      const populatedMessage =
        await Message.findById(newMessage._id).populate(
          'user',
          'name profileImage isAdmin'
        )

      io.emit('receive_message', populatedMessage)
    } catch (error) {
      console.log('❌ Public Message Error:', error.message)
    }
  })

  socket.on('join_private_chat', (conversationId) => {
    if (!conversationId) return

    socket.join(conversationId)

    console.log(
      `✅ User joined private room: ${conversationId}`
    )
  })

  socket.on('send_private_message', async (data) => {
    try {
      const {
        conversationId,
        senderId,
        receiverId,
        text,
        imageUrl,
      } = data

      if (
        !conversationId ||
        !senderId ||
        !receiverId ||
        (!text && !imageUrl)
      ) {
        return
      }

      const conversation =
        await Conversation.findById(conversationId)

      if (!conversation) return

      const isMember =
        conversation.members.some(
          (id) => id.toString() === senderId.toString()
        ) &&
        conversation.members.some(
          (id) => id.toString() === receiverId.toString()
        )

      if (!isMember) return

      const newPrivateMessage =
        await PrivateMessage.create({
          conversation: conversationId,
          sender: senderId,
          receiver: receiverId,
          text: text || '',
          imageUrl: imageUrl || '',
        })

      conversation.lastMessage =
        text || 'Image message'

      await conversation.save()

      const populatedPrivateMessage =
        await PrivateMessage.findById(
          newPrivateMessage._id
        )
          .populate(
            'sender',
            'name email profileImage image'
          )
          .populate(
            'receiver',
            'name email profileImage image'
          )

      io.to(conversationId).emit(
        'receive_private_message',
        populatedPrivateMessage
      )
    } catch (error) {
      console.log('❌ Private Message Error:', error.message)
    }
  })

  socket.on('private_typing', (data) => {
    const { conversationId, name } = data

    if (!conversationId) return

    socket.to(conversationId).emit(
      'private_typing',
      name
    )
  })

  socket.on('private_stop_typing', (conversationId) => {
    if (!conversationId) return

    socket.to(conversationId).emit(
      'private_stop_typing'
    )
  })

  socket.on('typing', (name) => {
    socket.broadcast.emit('typing', name)
  })

  socket.on('stop_typing', () => {
    socket.broadcast.emit('stop_typing')
  })

  socket.on('disconnect', () => {
    console.log('❌ User Disconnected:', socket.id)
  })
})

/* 404 ROUTE HANDLER */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  })
})

/* GLOBAL ERROR HANDLER */

app.use((err, req, res, next) => {
  console.log(err.stack)

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  })
})

/* START SERVER */

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})