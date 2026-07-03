const mongoose = require('mongoose')

const quoteItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    zohoProductId: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const quoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    dealer: {
      type: String,
      required: true,
      trim: true,
    },
    validTill: {
      type: Date,
    },
    items: [quoteItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    zohoRecordId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const Quote = mongoose.model('Quote', quoteSchema)

module.exports = {
  Quote,
}
