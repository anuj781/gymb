import express from 'express'

import {
  registerUser,
  loginUser,
  getMyProfile,
} from '../controllers/authController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/* =========================================
   AUTH ROUTES
========================================= */

/* REGISTER USER */

router.post(
  '/register',
  registerUser
)

/* LOGIN USER */

router.post(
  '/login',
  loginUser
)

/* GET LOGGED-IN USER PROFILE */

router.get(
  '/me',
  protect,
  getMyProfile
)

export default router