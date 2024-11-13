const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controller/product.controller');

router.get('/', getProducts);
router.get('/:id', getProductById)
router.post('/create', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports= router;