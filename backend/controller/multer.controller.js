const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình lưu trữ cho Multer
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
// Bộ lọc file (chỉ chấp nhận ảnh)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép tải lên file ảnh (jpeg, png, gif, webp).'), false);
    }
};
const MAX_FILE_SIZE = 5* 1024 * 1024; // 5MB
const upload = multer({ storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});

module.exports = upload;
