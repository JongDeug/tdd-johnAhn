const express = require('express');
const router = express.Router();
const productController = require('./controller/products');

// path : /api/products/
router.get('/', productController.getProducts);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createProduct);

module.exports = router;