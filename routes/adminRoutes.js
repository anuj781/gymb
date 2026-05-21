import express from 'express'

import {
  getAdminStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  changeMembership,
  deleteMessage,
  clearChat,

  assignGoalToUser,
  assignTrainerToUser,

  getAllTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,

  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,

  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,

  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/adminController.js'

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js'

const router = express.Router()

/* PROTECTED ADMIN ROUTES */

router.use(protect)
router.use(adminOnly)

/* DASHBOARD STATS */

router.get('/stats', getAdminStats)

/* USERS */

router.get('/users', getAllUsers)
router.put('/ban/:userId', banUser)
router.put('/unban/:userId', unbanUser)
router.put('/membership/:userId', changeMembership)
router.delete('/user/:userId', deleteUser)

/* GOAL ASSIGN */

router.post('/assign-goal/:userId', assignGoalToUser)

/* TRAINERS */

router.get('/trainers', getAllTrainers)
router.post('/trainers', createTrainer)
router.put('/trainers/:trainerId', updateTrainer)
router.delete('/trainers/:trainerId', deleteTrainer)
router.put('/assign-trainer/:userId', assignTrainerToUser)

/* PROGRAMS */

router.get('/programs', getAllPrograms)
router.post('/programs', createProgram)
router.put('/programs/:programId', updateProgram)
router.delete('/programs/:programId', deleteProgram)

/* PRICING */

router.get('/pricing', getAllPricingPlans)
router.post('/pricing', createPricingPlan)
router.put('/pricing/:pricingId', updatePricingPlan)
router.delete('/pricing/:pricingId', deletePricingPlan)

/* TESTIMONIALS */

router.get('/testimonials', getAllTestimonials)
router.post('/testimonials', createTestimonial)
router.put('/testimonials/:testimonialId', updateTestimonial)
router.delete('/testimonials/:testimonialId', deleteTestimonial)

/* CHAT MODERATION */

router.delete('/message/:messageId', deleteMessage)
router.delete('/chat/clear', clearChat)

export default router