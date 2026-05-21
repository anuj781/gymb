import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    /* USER INFO */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: 'Gym Member',
      trim: true,
    },

    /* TESTIMONIAL IMAGE */

    image: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },

    /* TESTIMONIAL MESSAGE */

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /* RATING */

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    /* STATUS */

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ADMIN */

    createdBy: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Testimonial = mongoose.model(
  'Testimonial',
  testimonialSchema
)

export default Testimonial