const express = require('express');
const router = express.router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controller/product.controller');
const dbConn = require('../database/db')

router.get('/', getProducts);
router.get('/:id', getProductById)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


module.exports= router;