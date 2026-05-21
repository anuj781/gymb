import User from '../models/User.js'
import Conversation from '../models/Conversation.js'
import PrivateMessage from '../models/PrivateMessage.js'

/* SEARCH USERS */

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || ''

    const users = await User.find({
      _id: {
        $ne: req.user._id,
      },
      isActive: true,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ],
    })
      .select('-password')
      .limit(20)

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* GET USER PROFILE */

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* CREATE OR GET CONVERSATION */

export const createOrGetConversation = async (
  req,
  res
) => {
  try {
    const senderId = req.user._id
    const receiverId = req.params.receiverId

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        message: 'You cannot chat with yourself',
      })
    }

    const receiver = await User.findById(receiverId)

    if (!receiver) {
      return res.status(404).json({
        message: 'Receiver user not found',
      })
    }

    let conversation = await Conversation.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    }).populate(
      'members',
      'name email profileImage image'
    )

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      })

      conversation = await Conversation.findById(
        conversation._id
      ).populate(
        'members',
        'name email profileImage image'
      )
    }

    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* GET SINGLE CONVERSATION */

export const getConversationById = async (
  req,
  res
) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    ).populate(
      'members',
      'name email profileImage image'
    )

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found',
      })
    }

    const isMember = conversation.members.some(
      (member) =>
        member._id.toString() ===
        req.user._id.toString()
    )

    if (!isMember) {
      return res.status(403).json({
        message: 'Not allowed',
      })
    }

    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* GET MY CONVERSATIONS */

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate(
        'members',
        'name email profileImage image'
      )
      .sort({
        updatedAt: -1,
      })

    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* GET PRIVATE MESSAGES */

export const getPrivateMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    )

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found',
      })
    }

    const isMember = conversation.members.some(
      (id) =>
        id.toString() === req.user._id.toString()
    )

    if (!isMember) {
      return res.status(403).json({
        message: 'Not allowed',
      })
    }

    const messages = await PrivateMessage.find({
      conversation: req.params.conversationId,
    })
      .populate(
        'sender',
        'name email profileImage image'
      )
      .populate(
        'receiver',
        'name email profileImage image'
      )
      .sort({
        createdAt: 1,
      })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* DELETE SINGLE PRIVATE MESSAGE */

export const deletePrivateMessage = async (req, res) => {
  try {
    const message = await PrivateMessage.findById(
      req.params.messageId
    )

    if (!message) {
      return res.status(404).json({
        message: 'Message not found',
      })
    }

    const isOwner =
      String(message.sender) ===
      String(req.user._id)

    const isAdmin =
      req.user?.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You can delete only your own message',
      })
    }

    await message.deleteOne()

    const lastMessage = await PrivateMessage.findOne({
      conversation: message.conversation,
    }).sort({
      createdAt: -1,
    })

    await Conversation.findByIdAndUpdate(
      message.conversation,
      {
        lastMessage: lastMessage
          ? lastMessage.text || 'Image message'
          : '',
      }
    )

    res.status(200).json({
      message: 'Message deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* DELETE FULL CONVERSATION */

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    )

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found',
      })
    }

    const isMember = conversation.members.some(
      (id) =>
        id.toString() === req.user._id.toString()
    )

    if (!isMember) {
      return res.status(403).json({
        message: 'Not allowed',
      })
    }

    await PrivateMessage.deleteMany({
      conversation: req.params.conversationId,
    })

    await conversation.deleteOne()

    res.status(200).json({
      message: 'Chat deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}