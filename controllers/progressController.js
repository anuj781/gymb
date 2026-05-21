import Progress from '../models/Progress.js'

/* =====================================
   GET USER PROGRESS
===================================== */

export const getProgressByUser =
  async (req, res) => {

    try {

      const progress =
        await Progress.find({
          user: req.params.userId,
        }).sort({ createdAt: -1 })

      res.json(progress)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   CREATE PROGRESS
===================================== */

export const createProgress =
  async (req, res) => {

    try {

      const progress =
        await Progress.create({
          user: req.body.user,
          weight: req.body.weight,
          caloriesBurned:
            req.body.caloriesBurned,
          workoutCompleted:
            req.body.workoutCompleted,
          waterIntake:
            req.body.waterIntake,
          stepsWalked:
            req.body.stepsWalked,
          date: req.body.date,
        })

      res.status(201).json(progress)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   UPDATE PROGRESS
===================================== */

export const updateProgress =
  async (req, res) => {

    try {

      const progress =
        await Progress.findById(
          req.params.id
        )

      if (!progress) {

        return res.status(404).json({
          message:
            'Progress not found',
        })

      }

      progress.weight =
        req.body.weight ??
        progress.weight

      progress.caloriesBurned =
        req.body.caloriesBurned ??
        progress.caloriesBurned

      progress.workoutCompleted =
        req.body.workoutCompleted ??
        progress.workoutCompleted

      progress.waterIntake =
        req.body.waterIntake ??
        progress.waterIntake

      progress.stepsWalked =
        req.body.stepsWalked ??
        progress.stepsWalked

      progress.date =
        req.body.date ??
        progress.date

      const updatedProgress =
        await progress.save()

      res.json(updatedProgress)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   DELETE PROGRESS
===================================== */

export const deleteProgress =
  async (req, res) => {

    try {

      const progress =
        await Progress.findById(
          req.params.id
        )

      if (!progress) {

        return res.status(404).json({
          message:
            'Progress not found',
        })

      }

      await progress.deleteOne()

      res.json({
        message:
          'Progress deleted',
      })

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }