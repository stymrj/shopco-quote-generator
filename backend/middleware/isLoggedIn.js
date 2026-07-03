const jwt = require('jsonwebtoken')
const { User } = require('../models/userSchema')

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      throw new Error('Please login first')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const foundUser = await User.findById(decoded.userId).select('-password')

    if (!foundUser) {
      throw new Error('Please login first')
    }

    req.user = foundUser
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    })
  }
}

const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      throw new Error('Only admin can access this route')
    }
    next()
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message,
    })
  }
}

module.exports = {
  isLoggedIn,
  isAdmin,
}
