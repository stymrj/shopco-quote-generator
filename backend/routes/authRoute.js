const express = require('express')
const { signIn, signUp, getMe, logout } = require('../controller/Auth')
const { isLoggedIn } = require('../middleware/isLoggedIn')

const router = express.Router()

router.post('/login', signIn)
router.post('/signup', signUp)
router.get('/me', isLoggedIn, getMe)
router.post('/logout', logout)

module.exports = {
  authRouter: router,
}
