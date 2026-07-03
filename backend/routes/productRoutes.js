const express = require('express')
const { isLoggedIn } = require('../middleware/isLoggedIn')
const {
  addProduct,
  seedProducts,
  getAllProducts,
  getTypes,
  getSingleProduct,
  getProductPhoto,
} = require('../controller/productController')

const router = express.Router()

router.use(isLoggedIn)

router.get('/types', getTypes)
router.get('/', getAllProducts)
router.get('/:id/photo', getProductPhoto)
router.get('/:id', getSingleProduct)
router.post('/add', addProduct)
router.post('/seed', seedProducts)

module.exports = {
  productRouter: router,
}
