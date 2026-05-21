import express from 'express'
import Goal from '../models/Goal.js'

const router = express.Router()

/* =========================
   CREATE GOAL (ADMIN)
========================= */
router.post('/', async (req, res) => {
  try {
    const goal = await Goal.create(req.body)
    res.json(goal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* =========================
   GET USER GOALS
========================= */
router.get('/user/:userId', async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.params.userId })
    res.json(goals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* =========================
   INCREMENT PROGRESS (+1/+5/+10)
========================= */
router.put('/:id/progress/increment', async (req, res) => {
  try {
    const { amount } = req.body

    const goal = await Goal.findById(req.params.id)

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    goal.currentProgress += amount

    // AUTO COMPLETE
    if (goal.currentProgress >= goal.target) {
      goal.completed = true
      goal.completionDate = new Date().toISOString()
    }

    await goal.save()

    res.json(goal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router