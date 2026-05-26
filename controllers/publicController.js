import Pricing from '../models/Pricing.js'
import Testimonial from '../models/Testimonial.js'
import Program from '../models/Program.js'
import Trainer from '../models/Trainer.js'
import User from '../models/User.js'

/* =========================
   PUBLIC STATS
========================= */

export const getPublicStats = async (
  req,
  res
) => {
  try {
    const users =
      await User.countDocuments()

    const trainers =
      await Trainer.countDocuments({
        isActive: true,
      })

    const programs =
      await Program.countDocuments({
        isActive: true,
      })

    const experience = 15

    res.status(200).json({
      users,
      trainers,
      programs,
      experience,
    })
  } catch (error) {
    console.log(
      'Public Stats Error:',
      error
    )

    res.status(500).json({
      message:
        error.message ||
        'Failed to fetch stats',
    })
  }
}

/* =========================
   PUBLIC PRICING PLANS
========================= */

export const getPublicPricingPlans = async (
  req,
  res
) => {
  try {
    const plans = await Pricing.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json(plans)
  } catch (error) {
    console.log(
      'Pricing Error:',
      error
    )

    res.status(500).json({
      message:
        error.message ||
        'Failed to fetch pricing plans',
    })
  }
}

/* =========================
   PUBLIC TESTIMONIALS
========================= */

export const getPublicTestimonials = async (
  req,
  res
) => {
  try {
    const testimonials =
      await Testimonial.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json(
      testimonials
    )
  } catch (error) {
    console.log(
      'Testimonials Error:',
      error
    )

    res.status(500).json({
      message:
        error.message ||
        'Failed to fetch testimonials',
    })
  }
}

/* =========================
   PUBLIC PROGRAMS
========================= */

export const getPublicPrograms = async (
  req,
  res
) => {
  try {
    const programs =
      await Program.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json(programs)
  } catch (error) {
    console.log(
      'Programs Error:',
      error
    )

    res.status(500).json({
      message:
        error.message ||
        'Failed to fetch programs',
    })
  }
}

/* =========================
   PUBLIC TRAINERS
========================= */

export const getPublicTrainers = async (
  req,
  res
) => {
  try {
    const trainers =
      await Trainer.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json(trainers)
  } catch (error) {
    console.log(
      'Trainers Error:',
      error
    )

    res.status(500).json({
      message:
        error.message ||
        'Failed to fetch trainers',
    })
  }
}