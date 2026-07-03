require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./database/db')
const { authRouter } = require('./routes/authRoute')
const { productRouter } = require('./routes/productRoutes')
const { quoteRouter } = require('./routes/quoteRoutes')

const app = express()

// Basic CORS without extra package
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ]
  const requestOrigin = req.headers.origin

  if (allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin)
  }

  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())
app.use(cookieParser())

connectDB()

app.get('/', (req, res) => {
  res.send('Shop.co Quote Generator API is running')
})

app.use('/api', authRouter)
app.use('/api/products', productRouter)
app.use('/api/quotes', quoteRouter)

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
