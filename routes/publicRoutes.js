import express from 'express'

import User from '../models/User.js'
import Trainer from '../models/Trainer.js'
import Program from '../models/Program.js'
import Pricing from '../models/Pricing.js'
import Testimonial from '../models/Testimonial.js'

const router = express.Router()

/* PUBLIC STATS */

router.get('/stats', async (req, res) => {
  try {
    const users = await User.countDocuments()

    const trainers =
      await Trainer.countDocuments()

    const programs =
      await Program.countDocuments()

    const experience = 15

    res.status(200).json({
      users,
      trainers,
      programs,
      experience,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch stats',
    })
  }
})

/* PUBLIC TRAINERS */

router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find({})
      .sort({ createdAt: -1 })

    res.status(200).json(trainers)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch trainers',
    })
  }
})

/* PUBLIC PROGRAMS */

router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find({})
      .sort({ createdAt: -1 })

    res.status(200).json(programs)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch programs',
    })
  }
})

/* PUBLIC PRICING */

router.get('/pricing', async (req, res) => {
  try {
    const pricing = await Pricing.find({})
      .sort({ createdAt: -1 })

    res.status(200).json(pricing)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch pricing plans',
    })
  }
})

/* PUBLIC TESTIMONIALS */

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials =
      await Testimonial.find({})
        .sort({ createdAt: -1 })

    res.status(200).json(testimonials)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch testimonials',
    })
  }
})

export default router