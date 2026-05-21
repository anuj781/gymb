import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/* =========================
   PROTECT ROUTE
========================= */

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        message: 'Not authorized, no token',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, token missing',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findById(
      decoded.id
    ).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account is banned',
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token failed',
    })
  }
}

/* =========================
   ADMIN ONLY
========================= */

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Not authorized',
    })
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: 'Admin access only',
    })
  }

  next()
}