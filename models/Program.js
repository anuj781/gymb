import mongoose from 'mongoose'

const programSchema = new mongoose.Schema(
  {
    /* BASIC INFO */

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

    image: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/2966/2966480.png',
    },

    /* PROGRAM TYPE */

    category: {
      type: String,
      enum: [
        'Weight Loss',
        'Muscle Gain',
        'Cardio',
        'Yoga',
        'Strength',
        'Flexibility',
        'Custom',
      ],
      default: 'Custom',
    },

    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },

    durationWeeks: {
      type: Number,
      default: 4,
      min: 1,
    },

    /* STRUCTURE */

    workouts: [
      {
        day: {
          type: String,
          trim: true,
        },

        exercises: [
          {
            name: {
              type: String,
              trim: true,
            },

            sets: {
              type: Number,
              default: 0,
            },

            reps: {
              type: Number,
              default: 0,
            },

            duration: {
              type: String,
              default: '',
              trim: true,
            },
          },
        ],
      },
    ],

    /* RELATION */

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      default: null,
    },

    /* STATUS */

    isActive: {
      type: Boolean,
      default: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    /* STATS */

    enrolledUsers: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    /* ADMIN */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Program = mongoose.model(
  'Program',
  programSchema
)

export default Program