const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },

    // Assignment fields
    sku: {
      type: String,
      default: '',
      trim: true,
    },
    modelName: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      default: 'Goods',
      trim: true,
    },
    unit: {
      type: String,
      default: 'Pcs',
      trim: true,
    },
    status: {
      type: String,
      default: 'Active',
      trim: true,
    },
    zohoProductId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = {
  Product,
}
