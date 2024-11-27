const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductByIdCategory } = require('../controller/product.controller');

router.get('/', getProducts);
router.get('/:id', getProductById)
router.get('/category/:categoryId', getProductByIdCategory)
router.post('/create', createProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports= router;