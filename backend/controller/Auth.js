const { User } = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const createTokenAndSendCookie = (res, user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, cookieOptions)
}

const sendUser = (res, statusCode, message, user) => {
  res.status(statusCode).json({
    success: true,
    message,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new Error('Please enter all details')
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    const bcryptPassword = await bcrypt.hash(password, 10)

    const createdUser = await User.create({
      name,
      email,
      password: bcryptPassword,
    })

    createTokenAndSendCookie(res, createdUser)
    sendUser(res, 201, 'Signup successful', createdUser)
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Please enter email and password')
    }

    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
      throw new Error('Invalid email or password')
    }

    createTokenAndSendCookie(res, user)
    sendUser(res, 200, 'Login successful', user)
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

const getMe = async (req, res) => {
  sendUser(res, 200, 'User fetched successfully', req.user)
}

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  })

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
}

module.exports = {
  signIn,
  signUp,
  getMe,
  logout,
}
