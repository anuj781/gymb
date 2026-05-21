import Program from '../models/Program.js'
import User from '../models/User.js'

/* =========================================
   ➤ CREATE PROGRAM (ADMIN ONLY)
========================================= */

export const createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      exercises,
      image,
    } = req.body

    const program = await Program.create({
      title,
      description,
      duration,
      level,
      exercises,
      image,
      isActive: true,
    })

    res.status(201).json(program)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET ALL PROGRAMS (PUBLIC)
========================================= */

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find()

    res.json(programs)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET SINGLE PROGRAM
========================================= */

export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(
      req.params.id
    )

    if (!program) {
      return res.status(404).json({
        message: 'Program not found',
      })
    }

    res.json(program)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ UPDATE PROGRAM (ADMIN)
========================================= */

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(
      req.params.id
    )

    if (!program) {
      return res.status(404).json({
        message: 'Program not found',
      })
    }

    program.title =
      req.body.title || program.title
    program.description =
      req.body.description ||
      program.description
    program.duration =
      req.body.duration ||
      program.duration
    program.level =
      req.body.level || program.level
    program.exercises =
      req.body.exercises ||
      program.exercises
    program.image =
      req.body.image || program.image
    program.isActive =
      req.body.isActive !== undefined
        ? req.body.isActive
        : program.isActive

    const updatedProgram =
      await program.save()

    res.json(updatedProgram)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ DELETE PROGRAM (ADMIN)
========================================= */

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(
      req.params.id
    )

    if (!program) {
      return res.status(404).json({
        message: 'Program not found',
      })
    }

    await program.deleteOne()

    res.json({
      message: 'Program deleted successfully',
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ ASSIGN PROGRAM TO USER (ADMIN)
========================================= */

export const assignProgramToUser = async (req, res) => {
  try {
    const { userId, programId } = req.body

    const user = await User.findById(userId)
    const program = await Program.findById(programId)

    if (!user || !program) {
      return res.status(404).json({
        message: 'User or Program not found',
      })
    }

    user.assignedProgram = programId

    await user.save()

    res.json({
      message: 'Program assigned successfully',
      user,
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}