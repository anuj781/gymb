import Pricing from '../models/Pricing.js'
import Testimonial from '../models/Testimonial.js'
import Program from '../models/Program.js'
import Trainer from '../models/Trainer.js'

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

    res.status(500).json({
      message: error.message,
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
      await Testimonial.find()
        .sort({
          createdAt: -1,
        })

    res.status(200).json(
      testimonials
    )

  } catch (error) {

    res.status(500).json({
      message: error.message,
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

    const programs = await Program.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json(programs)

  } catch (error) {

    res.status(500).json({
      message: error.message,
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

    const trainers = await Trainer.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json(trainers)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }
}