import express from 'express'

import {
  getProgressByUser,
  createProgress,
  updateProgress,
} from '../controllers/progressController.js'

const router = express.Router()

router.get('/:userId', getProgressByUser)

router.post('/', createProgress)

router.put('/:id', updateProgress)

export default router