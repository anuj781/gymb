import Goal from '../models/Goal.js'
import User from '../models/User.js'

/* =========================================
   ➤ ASSIGN GOAL (ADMIN ONLY)
========================================= */

export const assignGoal = async (req, res) => {
  try {
    const {
      userId,
      title,
      target,
      unit,
      assignedDate,
    } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const goal = await Goal.create({
      user: userId,
      title,
      target,
      unit,
      assignedDate,
      currentProgress: 0,
      completed: false,
    })

    res.status(201).json(goal)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET MY GOALS (USER DASHBOARD)
========================================= */

export const getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.json(goals)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET USER GOALS (ADMIN VIEW)
========================================= */

export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 })

    res.json(goals)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ UPDATE GOAL PROGRESS (USER)
========================================= */

export const updateGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(
      req.params.goalId
    )

    if (!goal) {
      return res.status(404).json({
        message: 'Goal not found',
      })
    }

    const { currentProgress } = req.body

    goal.currentProgress = currentProgress

    // AUTO COMPLETE LOGIC
    if (
      goal.currentProgress >= goal.target
    ) {
      goal.completed = true
    }

    await goal.save()

    res.json(goal)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ TOGGLE COMPLETE (ADMIN / USER)
========================================= */

export const toggleGoalComplete = async (req, res) => {
  try {
    const goal = await Goal.findById(
      req.params.goalId
    )

    if (!goal) {
      return res.status(404).json({
        message: 'Goal not found',
      })
    }

    goal.completed = !goal.completed

    await goal.save()

    res.json(goal)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ DELETE GOAL (ADMIN)
========================================= */

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(
      req.params.goalId
    )

    if (!goal) {
      return res.status(404).json({
        message: 'Goal not found',
      })
    }

    await goal.deleteOne()

    res.json({
      message: 'Goal deleted successfully',
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET ALL GOALS (ADMIN DASHBOARD)
========================================= */

export const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find()
      .populate(
        'user',
        'name email profileImage'
      )
      .sort({ createdAt: -1 })

    res.json(goals)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}