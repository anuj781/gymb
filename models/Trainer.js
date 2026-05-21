import mongoose from 'mongoose'

const trainerSchema = new mongoose.Schema(
  {
    /* BASIC INFO */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    image: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },

    /* PROFESSIONAL INFO */

    experience: {
      type: Number,
      default: 0,
    },

    specialization: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: '',
      trim: true,
    },

    certifications: {
      type: [String],
      default: [],
    },

    /* WORK INFO */

    availability: {
      type: String,
      enum: [
        'Available',
        'Busy',
        'Offline',
      ],
      default: 'Available',
    },

    workingHours: {
      start: {
        type: String,
        default: '06:00',
      },

      end: {
        type: String,
        default: '22:00',
      },
    },

    /* TRAINER FEES */

    monthlyFee: {
      type: Number,
      default: 0,
    },

    /* RELATION */

    assignedUsers: [
      {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    /* ADMIN CONTROL */

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    totalClients: {
      type: Number,
      default: 0,
    },

    /* SOCIAL */

    instagram: {
      type: String,
      default: '',
      trim: true,
    },

    youtube: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Trainer = mongoose.model(
  'Trainer',
  trainerSchema
)

export default Trainer