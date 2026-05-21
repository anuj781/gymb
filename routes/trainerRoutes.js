import express from 'express'

import {
  createTrainer,
  getTrainers,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController.js'

const router = express.Router()

/* =====================================
   GET ALL TRAINERS
===================================== */

router.get('/', getTrainers)

/* =====================================
   CREATE TRAINER
===================================== */

router.post('/', createTrainer)

/* =====================================
   UPDATE TRAINER
===================================== */

router.put('/:id', updateTrainer)

/* =====================================
   DELETE TRAINER
===================================== */

router.delete('/:id', deleteTrainer)

export default router