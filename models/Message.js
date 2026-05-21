import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    /* USER REFERENCE */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* SNAPSHOT DATA (IMPORTANT FOR CHAT HISTORY) */

    name: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },

    /* MESSAGE CONTENT */

    text: {
      type: String,
      required: true,
      trim: true,
    },

    /* CHAT TYPE */

    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },

    imageUrl: {
      type: String,
      default: '',
    },

    /* ADMIN CONTROL */

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Message = mongoose.model(
  'Message',
  messageSchema
)

export default Message