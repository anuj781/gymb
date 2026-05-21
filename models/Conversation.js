import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Conversation = mongoose.model(
  'Conversation',
  conversationSchema
)

export default Conversation