import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    /* BASIC INFO */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* EMAIL VERIFICATION */

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: '',
    },

    emailVerificationExpire: {
      type: Date,
      default: null,
    },

    /* FORGOT PASSWORD */

    resetPasswordToken: {
      type: String,
      default: '',
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    /* PROFILE */

    profileImage: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },

    bio: {
      type: String,
      default: '',
      trim: true,
    },

    age: {
      type: Number,
      default: 18,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    /* BODY INFO */

    height: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    targetWeight: {
      type: Number,
      default: 0,
    },

    bmi: {
      type: Number,
      default: 0,
    },

    /* MEMBERSHIP */

    membership: {
      type: String,
      enum: ['Basic', 'Premium', 'Elite'],
      default: 'Basic',
    },

    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pricing',
      default: null,
    },

    selectedPlanDate: {
      type: Date,
      default: null,
    },

    /* PROGRAM */

    selectedProgram: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      default: null,
    },

    selectedProgramDate: {
      type: Date,
      default: null,
    },

    /* TRAINER */

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      default: null,
    },

    assignedTrainerDate: {
      type: Date,
      default: null,
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

    /* FITNESS SUMMARY */

    completedWorkouts: {
      type: Number,
      default: 0,
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    /* ADMIN */

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    bannedReason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User