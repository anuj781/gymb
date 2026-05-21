import User from '../models/User.js'
import Goal from '../models/Goal.js'
import Message from '../models/Message.js'
import Trainer from '../models/Trainer.js'
import Program from '../models/Program.js'
import Pricing from '../models/Pricing.js'
import Testimonial from '../models/Testimonial.js'

const safeImage = (image) => {
  return typeof image === 'string' && image.trim() !== ''
    ? image
    : undefined
}

/* DASHBOARD STATS */

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const bannedUsers = await User.countDocuments({ isActive: false })
    const goals = await Goal.countDocuments()
    const completedGoals = await Goal.countDocuments({ completed: true })
    const messages = await Message.countDocuments()
    const trainers = await Trainer.countDocuments()
    const programs = await Program.countDocuments()
    const pricingPlans = await Pricing.countDocuments()
    const testimonials = await Testimonial.countDocuments()

    res.status(200).json({
      users,
      activeUsers,
      bannedUsers,
      goals,
      completedGoals,
      messages,
      trainers,
      programs,
      pricingPlans,
      testimonials,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* USERS */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('selectedPlan')
      .populate('selectedProgram')
      .populate('assignedTrainer', 'name specialization image')
      .sort({ createdAt: -1 })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const assignGoalToUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const goal = await Goal.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'Custom',
      target: Number(req.body.target) || 0,
      unit: req.body.unit,
      currentProgress: 0,
      completed: false,
      status: 'Pending',
      assignedDate: new Date().toISOString(),
      deadline: req.body.deadline || '',
      assignedByAdmin: true,
      assignedBy: req.user._id,
      priority: req.body.priority || 'Medium',
    })

    res.status(201).json({
      message: 'Goal assigned successfully',
      goal,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const assignTrainerToUser = async (req, res) => {
  try {
    const { trainerId } = req.body

    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const trainer = await Trainer.findById(trainerId)

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    user.assignedTrainer = trainer._id
    user.assignedTrainerDate = new Date()
    await user.save()

    if (
      !trainer.assignedUsers.some(
        (id) => id.toString() === user._id.toString()
      )
    ) {
      trainer.assignedUsers.push(user._id)
    }

    trainer.totalClients = trainer.assignedUsers.length
    await trainer.save()

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('selectedPlan')
      .populate('selectedProgram')
      .populate('assignedTrainer', 'name specialization image')

    res.status(200).json({
      message: 'Trainer assigned successfully',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* TRAINERS */

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 })
    res.status(200).json(trainers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create({
      name: req.body.name,
      email: req.body.email || '',
      phone: req.body.phone || '',
      image: safeImage(req.body.image),
      experience: Number(req.body.experience) || 0,
      specialization: Array.isArray(req.body.specialization)
        ? req.body.specialization
        : [],
      bio: req.body.bio || '',
      monthlyFee: Number(req.body.monthlyFee) || 0,
      availability: req.body.availability || 'Available',
      rating: Number(req.body.rating) || 5,
      instagram: req.body.instagram || '',
      youtube: req.body.youtube || '',
      isActive:
        req.body.isActive === undefined
          ? true
          : Boolean(req.body.isActive),
    })

    res.status(201).json({
      message: 'Trainer created',
      trainer,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId)

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    trainer.name = req.body.name ?? trainer.name
    trainer.email = req.body.email ?? trainer.email
    trainer.phone = req.body.phone ?? trainer.phone
    trainer.image = safeImage(req.body.image) || trainer.image
    trainer.experience =
      req.body.experience !== undefined
        ? Number(req.body.experience)
        : trainer.experience
    trainer.specialization = Array.isArray(req.body.specialization)
      ? req.body.specialization
      : trainer.specialization
    trainer.bio = req.body.bio ?? trainer.bio
    trainer.monthlyFee =
      req.body.monthlyFee !== undefined
        ? Number(req.body.monthlyFee)
        : trainer.monthlyFee
    trainer.availability = req.body.availability ?? trainer.availability
    trainer.rating =
      req.body.rating !== undefined
        ? Number(req.body.rating)
        : trainer.rating
    trainer.instagram = req.body.instagram ?? trainer.instagram
    trainer.youtube = req.body.youtube ?? trainer.youtube
    trainer.isActive =
      req.body.isActive !== undefined
        ? Boolean(req.body.isActive)
        : trainer.isActive

    await trainer.save()

    res.status(200).json({
      message: 'Trainer updated',
      trainer,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId)

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    await trainer.deleteOne()

    res.status(200).json({
      message: 'Trainer deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* PROGRAMS */

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate('assignedTrainer', 'name image specialization')
      .sort({ createdAt: -1 })

    res.status(200).json(programs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createProgram = async (req, res) => {
  try {
    const program = await Program.create({
      title: req.body.title,
      description: req.body.description || '',
      image: safeImage(req.body.image),
      category: req.body.category || 'Custom',
      level: req.body.level || 'Beginner',
      durationWeeks: Number(req.body.durationWeeks) || 4,
      price: Number(req.body.price) || 0,
      isPremium: Boolean(req.body.isPremium) || false,
      isActive:
        req.body.isActive === undefined
          ? true
          : Boolean(req.body.isActive),
      createdBy: req.user._id,
    })

    res.status(201).json({
      message: 'Program created',
      program,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId)

    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    program.title = req.body.title ?? program.title
    program.description = req.body.description ?? program.description
    program.image = safeImage(req.body.image) || program.image
    program.category = req.body.category ?? program.category
    program.level = req.body.level ?? program.level
    program.durationWeeks =
      req.body.durationWeeks !== undefined
        ? Number(req.body.durationWeeks)
        : program.durationWeeks
    program.price =
      req.body.price !== undefined
        ? Number(req.body.price)
        : program.price
    program.isPremium =
      req.body.isPremium !== undefined
        ? Boolean(req.body.isPremium)
        : program.isPremium
    program.isActive =
      req.body.isActive !== undefined
        ? Boolean(req.body.isActive)
        : program.isActive

    await program.save()

    res.status(200).json({
      message: 'Program updated',
      program,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId)

    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    await program.deleteOne()

    res.status(200).json({
      message: 'Program deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* PRICING */

export const getAllPricingPlans = async (req, res) => {
  try {
    const pricingPlans = await Pricing.find().sort({ createdAt: -1 })
    res.status(200).json(pricingPlans)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createPricingPlan = async (req, res) => {
  try {
    const pricing = await Pricing.create({
      title: req.body.title,
      description: req.body.description || '',
      image: safeImage(req.body.image),
      price: Number(req.body.price),
      durationInDays: Number(req.body.durationInDays) || 30,
      features: Array.isArray(req.body.features)
        ? req.body.features
        : [],
      type: req.body.type || 'Basic',
      discountPercentage: Number(req.body.discountPercentage) || 0,
      isPopular: Boolean(req.body.isPopular) || false,
      isActive:
        req.body.isActive === undefined
          ? true
          : Boolean(req.body.isActive),
      includesTrainerSupport:
        Boolean(req.body.includesTrainerSupport) || false,
      createdBy: req.user._id,
    })

    res.status(201).json({
      message: 'Pricing plan created',
      pricing,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updatePricingPlan = async (req, res) => {
  try {
    const pricing = await Pricing.findById(req.params.pricingId)

    if (!pricing) {
      return res.status(404).json({
        message: 'Pricing plan not found',
      })
    }

    pricing.title = req.body.title ?? pricing.title
    pricing.description = req.body.description ?? pricing.description
    pricing.image = safeImage(req.body.image) || pricing.image

    pricing.price =
      req.body.price !== undefined
        ? Number(req.body.price)
        : pricing.price

    pricing.durationInDays =
      req.body.durationInDays !== undefined
        ? Number(req.body.durationInDays)
        : pricing.durationInDays

    pricing.features = Array.isArray(req.body.features)
      ? req.body.features
      : pricing.features

    pricing.type = req.body.type ?? pricing.type

    pricing.discountPercentage =
      req.body.discountPercentage !== undefined
        ? Number(req.body.discountPercentage)
        : pricing.discountPercentage

    pricing.isPopular =
      req.body.isPopular !== undefined
        ? Boolean(req.body.isPopular)
        : pricing.isPopular

    pricing.isActive =
      req.body.isActive !== undefined
        ? Boolean(req.body.isActive)
        : pricing.isActive

    pricing.includesTrainerSupport =
      req.body.includesTrainerSupport !== undefined
        ? Boolean(req.body.includesTrainerSupport)
        : pricing.includesTrainerSupport

    await pricing.save()

    res.status(200).json({
      message: 'Pricing plan updated',
      pricing,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deletePricingPlan = async (req, res) => {
  try {
    const pricing = await Pricing.findById(req.params.pricingId)

    if (!pricing) {
      return res.status(404).json({ message: 'Pricing plan not found' })
    }

    await pricing.deleteOne()

    res.status(200).json({
      message: 'Pricing plan deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* TESTIMONIALS */

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 })
    res.status(200).json(testimonials)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      name: req.body.name,
      role: req.body.role || 'Gym Member',
      image: safeImage(req.body.image),
      message: req.body.message,
      rating: Number(req.body.rating) || 5,
      isActive:
        req.body.isActive === undefined
          ? true
          : Boolean(req.body.isActive),
      createdBy: req.user?._id || null,
    })

    res.status(201).json({
      message: 'Testimonial created',
      testimonial,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.testimonialId
    )

    if (!testimonial) {
      return res.status(404).json({
        message: 'Testimonial not found',
      })
    }

    testimonial.name = req.body.name ?? testimonial.name
    testimonial.role = req.body.role ?? testimonial.role
    testimonial.image = safeImage(req.body.image) || testimonial.image
    testimonial.message = req.body.message ?? testimonial.message
    testimonial.rating =
      req.body.rating !== undefined
        ? Number(req.body.rating)
        : testimonial.rating
    testimonial.isActive =
      req.body.isActive !== undefined
        ? Boolean(req.body.isActive)
        : testimonial.isActive

    await testimonial.save()

    res.status(200).json({
      message: 'Testimonial updated',
      testimonial,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.testimonialId
    )

    if (!testimonial) {
      return res.status(404).json({
        message: 'Testimonial not found',
      })
    }

    await testimonial.deleteOne()

    res.status(200).json({
      message: 'Testimonial deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* USER ACTIONS */

export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.isAdmin) {
      return res.status(403).json({
        message: 'Admin user cannot be banned',
      })
    }

    user.isActive = false
    user.bannedReason = req.body.reason || 'Banned by admin'

    await user.save()

    res.status(200).json({
      message: 'User banned successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.isActive = true
    user.bannedReason = ''

    await user.save()

    res.status(200).json({
      message: 'User unbanned successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.isAdmin) {
      return res.status(403).json({
        message: 'Admin user cannot be deleted',
      })
    }

    await user.deleteOne()

    res.status(200).json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const changeMembership = async (req, res) => {
  try {
    const { membership } = req.body

    const allowedMemberships = ['Basic', 'Premium', 'Elite']

    if (!allowedMemberships.includes(membership)) {
      return res.status(400).json({
        message: 'Invalid membership type',
      })
    }

    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.membership = membership

    await user.save()

    res.status(200).json({
      message: 'Membership updated',
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* CHAT */

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId)

    if (!message) {
      return res.status(404).json({
        message: 'Message not found',
      })
    }

    await message.deleteOne()

    res.status(200).json({
      message: 'Message deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const clearChat = async (req, res) => {
  try {
    await Message.deleteMany({})

    res.status(200).json({
      message: 'All chat cleared',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}