import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

const sendUserResponse = (user, res) => {
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
    isEmailVerified: user.isEmailVerified,
    token: generateToken(user._id),
  })
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

    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex')

    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex')

    const isAdmin =
      email === process.env.ADMIN_EMAIL

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      isEmailVerified: isAdmin ? true : false,
      emailVerificationToken: isAdmin
        ? ''
        : hashedVerificationToken,
      emailVerificationExpire: isAdmin
        ? null
        : Date.now() + 24 * 60 * 60 * 1000,
    })

    if (!isAdmin) {
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

      await sendEmail({
        to: user.email,
        subject: 'Verify Your GYM PRO Account',
        html: `
          <h2>Welcome to GYM PRO</h2>
          <p>Hello ${user.name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" target="_blank">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      })
    }

    res.status(201).json({
      success: true,
      message: isAdmin
        ? 'Admin account created successfully'
        : 'Account created successfully. Please verify your email before login.',
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

    if (!user.isEmailVerified && !user.isAdmin) {
      return res.status(403).json({
        message: 'Please verify your email before login',
        emailNotVerified: true,
      })
    }

    sendUserResponse(user, res)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* VERIFY EMAIL */

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification link',
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = ''
    user.emailVerificationExpire = null

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can login now.',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* RESEND VERIFICATION EMAIL */

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: 'Email is already verified',
      })
    }

    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex')

    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex')

    user.emailVerificationToken = hashedVerificationToken
    user.emailVerificationExpire =
      Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

    await sendEmail({
      to: user.email,
      subject: 'Verify Your GYM PRO Account',
      html: `
        <h2>Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyUrl}" target="_blank">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    })

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* FORGOT PASSWORD */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString('hex')

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedResetToken
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000

    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await sendEmail({
      to: user.email,
      subject: 'Reset Your GYM PRO Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    })

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* RESET PASSWORD */

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset link',
      })
    }

    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(
      password,
      salt
    )

    user.resetPasswordToken = ''
    user.resetPasswordExpire = null

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can login now.',
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