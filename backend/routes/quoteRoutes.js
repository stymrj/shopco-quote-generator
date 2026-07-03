const express = require('express')
const { isLoggedIn } = require('../middleware/isLoggedIn')
const {
  createQuote,
  getAllQuotes,
  getSingleQuote,
} = require('../controller/quoteController')

const router = express.Router()

// User must be logged in for creating/viewing quotes
router.use(isLoggedIn)

router.post('/', createQuote)
router.get('/', getAllQuotes)
router.get('/:id', getSingleQuote)

module.exports = {
  quoteRouter: router,
}
