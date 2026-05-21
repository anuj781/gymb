import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

/* REGISTER USER */

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    )

    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      isAdmin:
        email === process.env.ADMIN_EMAIL,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      bmi: user.bmi,
      membership: user.membership,
      instagram: user.instagram,
      youtube: user.youtube,
      completedWorkouts: user.completedWorkouts,
      caloriesBurned: user.caloriesBurned,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* LOGIN USER */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: `User is banned. ${user.bannedReason}`,
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      bmi: user.bmi,
      membership: user.membership,
      instagram: user.instagram,
      youtube: user.youtube,
      completedWorkouts: user.completedWorkouts,
      caloriesBurned: user.caloriesBurned,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* GET MY PROFILE */

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}