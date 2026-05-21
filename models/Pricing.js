import mongoose from 'mongoose'

const pricingSchema = new mongoose.Schema(
  {
    /* PLAN INFO */

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

    /* PLAN IMAGE */

    image: {
      type: String,
      default:
        'https://cdn-icons-png.flaticon.com/512/2331/2331970.png',
    },

    /* PRICE */

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    durationInDays: {
      type: Number,
      default: 30,
      min: 1,
    },

    /* FEATURES */

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    /* PLAN TYPE */

    type: {
      type: String,
      enum: [
        'Basic',
        'Premium',
        'Elite',
      ],
      default: 'Basic',
    },

    /* STATUS */

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* DISCOUNT SYSTEM */

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },

    /* TRAINER ACCESS */

    includesTrainerSupport: {
      type: Boolean,
      default: false,
    },

    /* ADMIN CONTROL */

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

/* AUTO CALCULATE FINAL PRICE */

pricingSchema.pre('save', function () {
  if (this.discountPercentage > 0) {
    this.finalPrice =
      this.price -
      (this.price * this.discountPercentage) / 100
  } else {
    this.finalPrice = this.price
  }

  this.finalPrice = Math.round(this.finalPrice)
})

const Pricing = mongoose.model(
  'Pricing',
  pricingSchema
)

export default Pricing