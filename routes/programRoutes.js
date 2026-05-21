import express from 'express'
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  assignProgramToUser,
} from '../controllers/programController.js'

const router = express.Router()

router.post('/', createProgram)
router.get('/', getAllPrograms)
router.get('/:id', getProgramById)
router.put('/:id', updateProgram)
router.delete('/:id', deleteProgram)
router.post('/assign', assignProgramToUser)

export default router