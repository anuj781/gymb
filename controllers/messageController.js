import Message from '../models/Message.js'

/* =========================================
   SEND / SAVE MESSAGE
========================================= */

export const sendMessage = async (req, res) => {
  try {
    const {
      user,
      name,
      profileImage,
      text,
      type,
      imageUrl,
    } = req.body

    if (!user || !text) {
      return res.status(400).json({
        message: 'User and text are required',
      })
    }

    const message = await Message.create({
      user,
      name: name || '',
      profileImage: profileImage || '',
      text,
      type: type || 'text',
      imageUrl: imageUrl || '',
    })

    const populatedMessage = await Message.findById(
      message._id
    ).populate(
      'user',
      'name email profileImage isAdmin'
    )

    res.status(201).json(populatedMessage)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   GET ALL MESSAGES
========================================= */

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate(
        'user',
        'name email profileImage isAdmin'
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

/* =========================================
   GET USER MESSAGES
========================================= */

export const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      user: req.params.user,
    })
      .populate(
        'user',
        'name email profileImage isAdmin'
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

/* =========================================
   DELETE MESSAGE
   Normal user: own message only
   Admin: all messages
========================================= */

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(
      req.params.messageId
    )

    if (!message) {
      return res.status(404).json({
        message: 'Message not found',
      })
    }

    const isOwner =
      String(message.user) ===
      String(req.user._id)

    const isAdmin =
      req.user?.isAdmin === true

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You can delete only your own message',
      })
    }

    await message.deleteOne()

    res.status(200).json({
      message: 'Message deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   CLEAR CHAT
   Admin only route should protect this
========================================= */

export const clearMessages = async (req, res) => {
  try {
    await Message.deleteMany({})

    res.status(200).json({
      message: 'All messages cleared',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}