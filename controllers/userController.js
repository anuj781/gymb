import User from '../models/User.js'
import Pricing from '../models/Pricing.js'
import Program from '../models/Program.js'
import Trainer from '../models/Trainer.js'

/* =========================
   COMMON POPULATE USER
========================= */

const getPopulatedUser = async (userId) => {
  return await User.findById(userId)
    .select('-password')
    .populate('selectedPlan')
    .populate('selectedProgram')
    .populate(
      'assignedTrainer',
      'name email phone image specialization experience bio monthlyFee availability rating instagram youtube'
    )
}

/* =========================
   GET USER PROFILE
========================= */

export const getUserProfile = async (req, res) => {
  try {
    const user = await getPopulatedUser(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   GET LOGGED IN USER DASHBOARD DATA
========================= */

export const getMyProfile = async (req, res) => {
  try {
    const user = await getPopulatedUser(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   UPDATE USER PROFILE
========================= */

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.name = req.body.name ?? user.name
    user.profileImage =
      req.body.profileImage ?? user.profileImage
    user.bio = req.body.bio ?? user.bio
    user.age = req.body.age ?? user.age
    user.gender = req.body.gender ?? user.gender
    user.phone = req.body.phone ?? user.phone

    user.height = req.body.height ?? user.height
    user.weight = req.body.weight ?? user.weight
    user.targetWeight =
      req.body.targetWeight ?? user.targetWeight

    user.bmi =
      req.body.height && req.body.weight
        ? Number(
            (
              req.body.weight /
              ((req.body.height / 100) *
                (req.body.height / 100))
            ).toFixed(1)
          )
        : user.bmi

    user.membership =
      req.body.membership ?? user.membership

    user.instagram =
      req.body.instagram ?? user.instagram

    user.youtube =
      req.body.youtube ?? user.youtube

    const updatedUser = await user.save()

    const cleanUser = await getPopulatedUser(
      updatedUser._id
    )

    return res.status(200).json(cleanUser)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   SELECT PRICING PLAN
========================= */

export const selectPlan = async (req, res) => {
  try {
    const plan = await Pricing.findById(req.params.planId)

    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.selectedPlan = plan._id
    user.selectedPlanDate = new Date()

    if (plan.type) {
      user.membership = plan.type
    }

    await user.save()

    const updatedUser = await getPopulatedUser(user._id)

    res.status(200).json({
      message: 'Plan selected successfully',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   SELECT PROGRAM
========================= */

export const selectProgram = async (req, res) => {
  try {
    const program = await Program.findById(
      req.params.programId
    )

    if (!program) {
      return res.status(404).json({
        message: 'Program not found',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.selectedProgram = program._id
    user.selectedProgramDate = new Date()

    await user.save()

    const updatedUser = await getPopulatedUser(user._id)

    res.status(200).json({
      message: 'Program selected successfully',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   SELECT TRAINER
========================= */

export const selectTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(
      req.params.trainerId
    )

    if (!trainer) {
      return res.status(404).json({
        message: 'Trainer not found',
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
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

    const updatedUser = await getPopulatedUser(user._id)

    res.status(200).json({
      message: 'Trainer selected successfully',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('selectedPlan')
      .populate('selectedProgram')
      .populate(
        'assignedTrainer',
        'name email phone image specialization experience bio monthlyFee availability rating'
      )

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   DELETE USER
========================= */

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    await user.deleteOne()

    res.status(200).json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   BAN / UNBAN USER
========================= */

export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.isActive = !user.isActive

    user.bannedReason = user.isActive
      ? ''
      : req.body.reason || 'No reason provided'

    await user.save()

    const cleanUser = await getPopulatedUser(user._id)

    res.status(200).json({
      message: `User ${
        cleanUser.isActive ? 'unbanned' : 'banned'
      } successfully`,
      user: cleanUser,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================
   UPDATE MEMBERSHIP
========================= */

export const updateMembership = async (req, res) => {
  try {
    const { membership } = req.body

    const allowedMemberships = [
      'Basic',
      'Premium',
      'Elite',
    ]

    if (!allowedMemberships.includes(membership)) {
      return res.status(400).json({
        message: 'Invalid membership type',
      })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.membership = membership

    await user.save()

    const updatedUser = await getPopulatedUser(user._id)

    res.status(200).json({
      message: 'Membership updated',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}