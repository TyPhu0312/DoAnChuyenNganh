const express = require('express');
const router = express.Router();
const upload = require('../controller/multer.controller');
const { createProduct,
     getProducts, 
     getProductById, 
     updateProduct, 
     deleteProduct, 
     getProductByIdCategory, 
     getProductByArtist } = require('../controller/product.controller');

// Định nghĩa các route
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductByIdCategory);
router.get('./artist/:artistId', getProductByArtist);
router.post('/create', upload.single('thumbnail'), createProduct); // Middleware upload trước createProduct
router.put('/update/:id', upload.single('thumbnail'), updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
