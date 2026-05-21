import mongoose from 'mongoose'

const goalSchema = mongoose.Schema(
  {
    /* USER */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* GOAL INFO */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'Workout',
        'Cardio',
        'Water',
        'Diet',
        'Running',
        'Steps',
        'Weight',
        'Custom',
      ],
      default: 'Custom',
    },

    /* TARGET */

    target: {
      type: Number,
      required: true,
    },

    currentProgress: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    /* STATUS */

    completed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },

    completionDate: {
      type: String,
      default: '',
    },

    assignedDate: {
      type: String,
      required: true,
    },

    deadline: {
      type: String,
      default: '',
    },

    /* STREAK */

    streakCount: {
      type: Number,
      default: 0,
    },

    /* ADMIN */

    assignedByAdmin: {
      type: Boolean,
      default: false,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    /* PRIORITY */

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
)

const Goal = mongoose.model('Goal', goalSchema)

export default Goal