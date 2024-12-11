const dbConnect = require('../database/db')
const crypto = require('crypto');
const multer = require("multer");
const path = require("path");
//hàm chuyển những cau query về thành promsise function
const queryAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        dbConnect.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const getProducts = async (req, res) => {
    try {
        const data = await queryAsync(`
            SELECT 
                p.id, 
                p.title, 
                p.author, 
                p.price, 
                p.thumbnail, 
                p.description, 
                p.categoryId, 
                c.name as categoryName  -- Already selecting the category name here
            FROM 
                qlbantranh.product p
            LEFT JOIN 
                qlbantranh.category c
            ON 
                p.categoryId = c.id
        `);
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy sản phẩm nào"
            });
        }
        res.status(200).send({
            success: true,
            message: 'Tất cả sản phẩm',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Không lấy được API sản phẩm',
            error: error,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy ID!'
            });
        }

        // Fetch product by ID with category name
        const dataWithId = await queryAsync(`
            SELECT 
                p.id, 
                p.title, 
                p.author, 
                p.price, 
                p.thumbnail, 
                p.description, 
                p.categoryId, 
                c.name as categoryName  -- Join category to get category name
            FROM 
                qlbantranh.product p
            LEFT JOIN 
                qlbantranh.category c
            ON 
                p.categoryId = c.id
            WHERE 
                p.id = ?
        `, [id]);

        if (!dataWithId || dataWithId.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không thấy data từ database',
            });
        }

        res.status(200).send({
            success: true,
            ProductDetail: dataWithId[0],  // Sending the product details with category name
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductByIdCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).send({
                success: false,
                message: "Không tìm thấy categoryId!",
            });
        }

        const dataByCategory = await queryAsync(`
            SELECT 
                p.id, 
                p.title, 
                p.author, 
                p.price, 
                p.thumbnail, 
                p.description, 
                p.categoryId, 
                c.name as categoryName  -- Already joining category table to get category name
            FROM 
                qlbantranh.product p
            LEFT JOIN 
                qlbantranh.category c
            ON 
                p.categoryId = c.id
            WHERE 
                p.categoryId = ?
        `, [categoryId]);

        if (!dataByCategory || dataByCategory.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy sản phẩm trong danh mục này.",
            });
        }

        res.status(200).send({
            success: true,
            message: `Sản phẩm trong danh mục ${categoryId}`,
            data: dataByCategory,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API sản phẩm theo danh mục',
            error,
        });
    }
};

///////
const fs = require('fs');
const createProduct = async (req, res) => {
    try {
        const { title, author, price, description, categoryId } = req.body;

        // Kiểm tra nếu file không tồn tại
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please upload a thumbnail image.",
            });
        }

        // Lấy thông tin file từ multer
        const thumbnail = req.file.filename; // Lấy tên file
        const backendPath = path.join(__dirname, '../public/images', thumbnail); // File đã lưu ở backend
        const frontendPath = path.join(__dirname, '../../frontend/public/images', thumbnail); // Đường dẫn lưu ở frontend

        // Sao chép file từ backend sang frontend
        if (!fs.existsSync(path.dirname(frontendPath))) {
            fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
        }
        fs.copyFileSync(backendPath, frontendPath);

        // Validate các trường còn lại
        if (!title || !author || !price || !categoryId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu thông tin cần thiết (title, author, price, categoryId).",
            });
        }

        // Tạo ID sản phẩm
        const id = crypto.randomUUID();

        // Thêm sản phẩm vào database
        const result = await queryAsync(
            `INSERT INTO product (id, title, author, price, thumbnail, description, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, title, author, price, `${thumbnail}`, description, categoryId]
        );

        // Kiểm tra nếu INSERT thất bại
        if (!result) {
            return res.status(500).send({
                success: false,
                message: "Không thể tạo sản phẩm trong cơ sở dữ liệu.",
            });
        }

        // Phản hồi thành công
        res.status(201).send({
            success: true,
            message: "Sản phẩm đã được tạo thành công!",
            thumbnailUrl: `${thumbnail}`,
        });
    } catch (error) {
        console.error("Lỗi trong createProduct:", error);
        res.status(500).send({
            success: false,
            message: "Đã xảy ra lỗi khi tạo sản phẩm.",
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy sản phẩm này',
            });
        }
        const { title, author, price, thumbnail, categoryId, description } = req.body;
        if (!title || !author || !price || !thumbnail || !description || !categoryId) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }

        const data = await queryAsync(
            `UPDATE product 
             SET title = ?, author = ?, price = ?, thumbnail = ?, description = ?, categoryId = ?
             WHERE id = ?`, // Điều kiện WHERE
            [title, author, price, thumbnail, description, categoryId, id]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Cập nhật sản phẩm thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update product!',
            error,
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        //console.log("ProductId:", id);
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy sản phẩm này',
            });
        }
        await queryAsync(
            `DELETE FROM product 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá sản phẩm thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete product!',
            error,
        });
    }
};

module.exports = { getProducts, getProductById, getProductByIdCategory, createProduct, updateProduct, deleteProduct };