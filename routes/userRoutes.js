import express from 'express'

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js'

import {
  getUserProfile,
  getMyProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  toggleBanUser,
  updateMembership,
  selectPlan,
  selectProgram,
  selectTrainer,
} from '../controllers/userController.js'

const router = express.Router()

/* =========================
   LOGGED IN USER PROFILE
========================= */

router.get(
  '/me',
  protect,
  getMyProfile
)

/* =========================
   SELECT PLAN
========================= */

router.put(
  '/select-plan/:planId',
  protect,
  selectPlan
)

/* =========================
   SELECT PROGRAM
========================= */

router.put(
  '/select-program/:programId',
  protect,
  selectProgram
)

/* =========================
   SELECT TRAINER
========================= */

router.put(
  '/select-trainer/:trainerId',
  protect,
  selectTrainer
)

/* =========================
   GET ALL USERS
========================= */

router.get(
  '/',
  protect,
  adminOnly,
  getAllUsers
)

/* =========================
   UPDATE PROFILE
========================= */

router.put(
  '/profile/:id',
  protect,
  updateUserProfile
)

/* =========================
   GET SINGLE USER
========================= */

router.get(
  '/:id',
  protect,
  getUserProfile
)

/* =========================
   DELETE USER
========================= */

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteUser
)

/* =========================
   BAN / UNBAN USER
========================= */

router.put(
  '/ban/:id',
  protect,
  adminOnly,
  toggleBanUser
)

/* =========================
   UPDATE MEMBERSHIP
========================= */

router.put(
  '/membership/:id',
  protect,
  adminOnly,
  updateMembership
)

export default router