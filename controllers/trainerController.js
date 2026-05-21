import Trainer from '../models/Trainer.js'

/* =====================================
   GET ALL TRAINERS
===================================== */

export const getTrainers =
  async (req, res) => {

    try {

      const trainers =
        await Trainer.find()

      res.json(trainers)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   CREATE TRAINER
===================================== */

export const createTrainer =
  async (req, res) => {

    try {

      const trainer =
        await Trainer.create({
          name: req.body.name,
          image: req.body.image,
          specialty:
            req.body.specialty,
          experience:
            req.body.experience,
          bio: req.body.bio,
        })

      res.status(201).json(
        trainer
      )

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   UPDATE TRAINER
===================================== */

export const updateTrainer =
  async (req, res) => {

    try {

      const trainer =
        await Trainer.findById(
          req.params.id
        )

      if (!trainer) {

        return res.status(404).json({
          message:
            'Trainer not found',
        })

      }

      trainer.name =
        req.body.name ||
        trainer.name

      trainer.image =
        req.body.image ||
        trainer.image

      trainer.specialty =
        req.body.specialty ||
        trainer.specialty

      trainer.experience =
        req.body.experience ||
        trainer.experience

      trainer.bio =
        req.body.bio ||
        trainer.bio

      const updatedTrainer =
        await trainer.save()

      res.json(updatedTrainer)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* =====================================
   DELETE TRAINER
===================================== */

export const deleteTrainer =
  async (req, res) => {

    try {

      const trainer =
        await Trainer.findById(
          req.params.id
        )

      if (!trainer) {

        return res.status(404).json({
          message:
            'Trainer not found',
        })

      }

      await trainer.deleteOne()

      res.json({
        message:
          'Trainer deleted successfully',
      })

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }