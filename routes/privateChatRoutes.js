import express from 'express'

import {
  protect,
} from '../middleware/authMiddleware.js'

import {
  searchUsers,
  getUserProfile,
  createOrGetConversation,
  getConversationById,
  getMyConversations,
  getPrivateMessages,
  deleteConversation,
  deletePrivateMessage,
} from '../controllers/privateChatController.js'

const router = express.Router()

/* SEARCH USERS */

router.get(
  '/users/search',
  protect,
  searchUsers
)

/* GET USER PROFILE */

router.get(
  '/profile/:userId',
  protect,
  getUserProfile
)

/* CREATE OR GET CONVERSATION */

router.post(
  '/conversation/:receiverId',
  protect,
  createOrGetConversation
)

/* GET SINGLE CONVERSATION */

router.get(
  '/conversation/:conversationId',
  protect,
  getConversationById
)

/* DELETE FULL CONVERSATION */

router.delete(
  '/conversation/:conversationId',
  protect,
  deleteConversation
)

/* DELETE SINGLE PRIVATE MESSAGE */

router.delete(
  '/message/:messageId',
  protect,
  deletePrivateMessage
)

/* GET MY CONVERSATIONS */

router.get(
  '/conversations',
  protect,
  getMyConversations
)

/* GET PRIVATE MESSAGES */

router.get(
  '/messages/:conversationId',
  protect,
  getPrivateMessages
)

export default router