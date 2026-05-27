import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'

/* GENERATE JWT TOKEN */

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

/* SEND USER RESPONSE */

const sendUserResponse = (user, res) => {
  res.status(200).json({
    success: true,

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

    /* VALIDATION */

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all fields',
      })
    }

    /* CHECK USER */

    const userExists = await User.findOne({
      email,
    })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      })
    }

    /* HASH PASSWORD */

    const salt = await bcrypt.genSalt(10)

    const hashedPassword =
      await bcrypt.hash(password, salt)

    /* CREATE EMAIL TOKEN */

    const verificationToken =
      crypto.randomBytes(32).toString('hex')

    const hashedVerificationToken =
      crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex')

    /* ADMIN CHECK */

    const isAdmin =
      email === process.env.ADMIN_EMAIL

    /* CREATE USER */

    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      isAdmin,

      isEmailVerified: isAdmin
        ? true
        : false,

      emailVerificationToken: isAdmin
        ? ''
        : hashedVerificationToken,

      emailVerificationExpire: isAdmin
        ? null
        : Date.now() +
          24 * 60 * 60 * 1000,
    })

    /* SEND VERIFICATION EMAIL */

    if (!isAdmin) {
      try {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

        await sendEmail({
          to: user.email,

          subject:
            'Verify Your GYM PRO Account',

          html: `
            <h2>Welcome to GYM PRO</h2>

            <p>Hello ${user.name},</p>

            <p>
              Please verify your email by clicking the button below:
            </p>

            <a
              href="${verifyUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#ff3c00;
                color:white;
                text-decoration:none;
                border-radius:5px;
              "
            >
              Verify Email
            </a>

            <p>
              This link will expire in 24 hours.
            </p>
          `,
        })
      } catch (emailError) {
        console.log(
          'Verification Email Error:',
          emailError.message
        )
      }
    }

    res.status(201).json({
      success: true,

      message: isAdmin
        ? 'Admin account created successfully'
        : 'Account created successfully. Please verify your email.',

      token: generateToken(user._id),
    })
  } catch (error) {
    console.log(
      'Register Error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        error.message || 'Register failed',
    })
  }
}

/* LOGIN USER */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email,
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: `User is banned. ${user.bannedReason}`,
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      })
    }

    if (
      !user.isEmailVerified &&
      !user.isAdmin
    ) {
      return res.status(403).json({
        success: false,

        message:
          'Please verify your email before login',

        emailNotVerified: true,
      })
    }

    sendUserResponse(user, res)
  } catch (error) {
    console.log(
      'Login Error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        error.message || 'Login failed',
    })
  }
}

/* VERIFY EMAIL */

export const verifyEmail = async (
  req,
  res
) => {
  try {
    const { token } = req.params

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      emailVerificationToken:
        hashedToken,

      emailVerificationExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        success: false,

        message:
          'Invalid or expired verification link',
      })
    }

    user.isEmailVerified = true

    user.emailVerificationToken = ''

    user.emailVerificationExpire = null

    await user.save()

    res.status(200).json({
      success: true,

      message:
        'Email verified successfully. You can login now.',
    })
  } catch (error) {
    console.log(
      'Verify Email Error:',
      error.message
    )

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Email verification failed',
    })
  }
}

/* RESEND VERIFICATION EMAIL */

export const resendVerificationEmail =
  async (req, res) => {
    try {
      const { email } = req.body

      const user = await User.findOne({
        email,
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message:
            'Email is already verified',
        })
      }

      const verificationToken =
        crypto
          .randomBytes(32)
          .toString('hex')

      const hashedVerificationToken =
        crypto
          .createHash('sha256')
          .update(verificationToken)
          .digest('hex')

      user.emailVerificationToken =
        hashedVerificationToken

      user.emailVerificationExpire =
        Date.now() +
        24 * 60 * 60 * 1000

      await user.save()

      try {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

        await sendEmail({
          to: user.email,

          subject:
            'Verify Your GYM PRO Account',

          html: `
            <h2>Verify Your Email</h2>

            <p>Hello ${user.name},</p>

            <p>
              Click the button below to verify your email:
            </p>

            <a
              href="${verifyUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#ff3c00;
                color:white;
                text-decoration:none;
                border-radius:5px;
              "
            >
              Verify Email
            </a>

            <p>
              This link will expire in 24 hours.
            </p>
          `,
        })
      } catch (emailError) {
        console.log(
          'Resend Verification Error:',
          emailError.message
        )
      }

      res.status(200).json({
        success: true,

        message:
          'Verification email sent successfully',
      })
    } catch (error) {
      console.log(
        'Resend Verification Error:',
        error.message
      )

      res.status(500).json({
        success: false,

        message:
          error.message ||
          'Failed to resend verification email',
      })
    }
  }

/* FORGOT PASSWORD */

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body

    const user = await User.findOne({
      email,
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const resetToken =
      crypto.randomBytes(32).toString(
        'hex'
      )

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken =
      hashedResetToken

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000

    await user.save()

    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

      await sendEmail({
        to: user.email,

        subject:
          'Reset Your GYM PRO Password',

        html: `
          <h2>Password Reset Request</h2>

          <p>Hello ${user.name},</p>

          <p>
            Click the button below to reset your password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#ff3c00;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in 15 minutes.
          </p>
        `,
      })
    } catch (emailError) {
      console.log(
        'Forgot Password Email Error:',
        emailError.message
      )
    }

    res.status(200).json({
      success: true,

      message:
        'Password reset email sent successfully',
    })
  } catch (error) {
    console.log(
      'Forgot Password Error:',
      error.message
    )

    res.status(500).json({
      success: false,

      message:
        error.message ||
        'Forgot password failed',
    })
  }
}

/* RESET PASSWORD */

export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params

    const { password } = req.body

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken:
        hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    })

    if (!user) {
      return res.status(400).json({
        success: false,

        message:
          'Invalid or expired reset link',
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

      message:
        'Password reset successfully. You can login now.',
    })
  } catch (error) {
    console.log(
      'Reset Password Error:',
      error.message
    )

    res.status(500).json({
      success: false,

      message:
        error.message ||
        'Password reset failed',
    })
  }
}

/* GET MY PROFILE */

export const getMyProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.log(
      'Get Profile Error:',
      error.message
    )

    res.status(500).json({
      success: false,

      message:
        error.message ||
        'Failed to get profile',
    })
  }
}