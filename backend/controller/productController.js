const mongoose = require('mongoose')
const { Product } = require('../models/productSchema')
const { sampleProducts } = require('../data/sampleProducts')
const {
  isZohoEnabled,
  fetchZohoProducts,
  fetchZohoProductById,
  fetchZohoProductPhoto,
} = require('./zohoService')

const getSampleProducts = (type) =>
  sampleProducts
    .map((product, index) => ({
      ...product,
      _id: `sample-${index + 1}`,
    }))
    .filter((product) => !type || type === 'All' || product.type === type)

const getLocalProducts = async (type) => {
  const filter = { status: 'Active' }
  if (type && type !== 'All') {
    filter.type = type
  }

  let products = []
  if (mongoose.connection.readyState === 1) {
    products = await Product.find(filter).sort({ createdAt: -1 })
  }

  if (products.length === 0) {
    products = getSampleProducts(type)
  }

  return products
}

const getLocalTypes = async () => {
  let types = []
  if (mongoose.connection.readyState === 1) {
    types = await Product.distinct('type', { status: 'Active' })
  }

  if (types.length === 0) {
    types = [...new Set(sampleProducts.map((product) => product.type))]
  }

  return types
}

const addProduct = async (req, res) => {
  try {
    const { name, description, image, price, category, stock, sku, modelName, type, unit, status } = req.body

    if (!name || !price) {
      throw new Error('Product name and price are required')
    }

    const product = await Product.create({
      name,
      description,
      image,
      price,
      category,
      stock,
      sku,
      modelName,
      type,
      unit,
      status,
    })

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({})
    const products = await Product.insertMany(sampleProducts)

    res.status(201).json({
      success: true,
      message: 'Sample products added',
      products,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const { type } = req.query

    if (isZohoEnabled()) {
      const products = await fetchZohoProducts(type)
      return res.status(200).json({ success: true, products })
    }

    const products = await getLocalProducts(type)

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

const getTypes = async (req, res) => {
  try {
    if (isZohoEnabled()) {
      const products = await fetchZohoProducts()
      const types = [...new Set(products.map((product) => product.type).filter(Boolean))]
      return res.status(200).json({ success: true, types })
    }

    const types = await getLocalTypes()

    res.status(200).json({ success: true, types })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (isZohoEnabled()) {
      const product = await fetchZohoProductById(id)
      return res.status(200).json({ success: true, product })
    }

    if (id.startsWith('sample-')) {
      const index = Number(id.split('-')[1]) - 1
      const product = { ...sampleProducts[index], _id: id }
      return res.status(200).json({ success: true, product })
    }

    const product = await Product.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
}

const getProductPhoto = async (req, res) => {
  try {
    if (!isZohoEnabled()) {
      return res.redirect('https://via.placeholder.com/600x400?text=Product')
    }

    const { buffer, contentType } = await fetchZohoProductPhoto(req.params.id)
    res.set('Content-Type', contentType)
    res.send(buffer)
  } catch (error) {
    res.redirect('https://via.placeholder.com/600x400?text=No+Image')
  }
}

module.exports = {
  addProduct,
  seedProducts,
  getAllProducts,
  getTypes,
  getSingleProduct,
  getProductPhoto,
}
