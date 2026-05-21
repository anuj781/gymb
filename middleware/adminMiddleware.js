const adminMiddleware = (req, res, next) => {
  try {
    /* CHECK IF USER EXISTS */
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized, no user found',
      })
    }

    /* CHECK ADMIN ROLE */
    if (req.user.isAdmin) {
      next()
    } else {
      return res.status(403).json({
        message: 'Not authorized as admin',
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Server error in admin middleware',
    })
  }
}

export default adminMiddleware