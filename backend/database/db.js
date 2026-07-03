require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('MONGO_URI missing. Add it in .env')
      return
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected successfully!')
  } catch (error) {
    console.log('Database connection failed:', error.message)
  }
}

module.exports = {
  connectDB,
}
