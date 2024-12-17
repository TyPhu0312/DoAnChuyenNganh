const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createProduct,
     getProducts, 
     getProductById, 
     updateProduct, 
     deleteProduct, 
     getProductByIdCategory, 
     getProductByArtist } = require('../controller/product.controller');

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/images'); // Đường dẫn lưu file trong backend
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
        }
        cb(null, uploadPath); // Lưu file vào thư mục backend
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
});
const upload = multer({ storage: storage });

// Định nghĩa các route
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductByIdCategory);
router.get('./artist/:artistId', getProductByArtist);
router.post('/create', upload.single('thumbnail'), createProduct); // Middleware upload trước createProduct
router.put('/update/:id', upload.single('thumbnail'), updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
