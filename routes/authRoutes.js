import express from 'express'

import {
  registerUser,
  loginUser,
  getMyProfile,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/* REGISTER USER */

router.post('/register', registerUser)

/* LOGIN USER */

router.post('/login', loginUser)

/* VERIFY EMAIL */

router.get('/verify-email/:token', verifyEmail)

/* RESEND VERIFICATION EMAIL */

router.post('/resend-verification', resendVerificationEmail)

/* FORGOT PASSWORD */

router.post('/forgot-password', forgotPassword)

/* RESET PASSWORD */

router.put('/reset-password/:token', resetPassword)

/* GET LOGGED-IN USER PROFILE */

router.get('/me', protect, getMyProfile)

export default router