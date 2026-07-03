const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  amount: Number,
})

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Cart = mongoose.model('Cart', cartSchema)

module.exports = { Cart }
