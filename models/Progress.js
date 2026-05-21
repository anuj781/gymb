import mongoose from 'mongoose'

const progressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    weight: {
      type: Number,
      default: 0,
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    workoutCompleted: {
      type: Boolean,
      default: false,
    },

    waterIntake: {
      type: Number,
      default: 0,
    },

    stepsWalked: {
      type: Number,
      default: 0,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Progress = mongoose.model(
  'Progress',
  progressSchema
)

export default Progress