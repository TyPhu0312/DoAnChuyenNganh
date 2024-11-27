const dbConnect = require('../database/db')
const crypto = require('crypto');
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
const getProducts = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.product'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy product nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả sản phẩm',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API sản phẩm',
            error: error,
        })
    }
};
const getProductById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.product WHERE id =?`,[id]);
        if(!dataWithId) {
            return res.status(404).send({
                success: false,
                message:'Không thấy data từ database',
            });
        }    
        res.status(200).send({
            success: true,
            ProductDetail: dataWithId
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
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
        const dataByCategory = await queryAsync(
            `SELECT * FROM qlbantranh.product WHERE categoryId = ?`, [categoryId]
        );
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

const createProduct = async (req, res) => {
    try {
        const { title, author, price, thumbnail, description, categoryId } = req.body;
        if(!title) {return res.status(400).send({
            success: false,
            message: "Thiếu trường title",
        });}
        if(!author) {return res.status(400).send({
            success: false,
            message: "Thiếutac gia",
        });}
        if(!price) {return res.status(400).send({
            success: false,
            message: "Thiếu gia",
        });}
        if(!thumbnail) {return res.status(400).send({
            success: false,
            message: "Thiếu thumb",
        });}
        // if (!title || !categoryId || !author || !price) {
            
        //     return res.status(400).send({
        //         success: false,
        //         message: "Thiếu trường thông tin bắt buộc",
        //     });
        // }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO product (id, title, author, price, thumbnail, description, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, title, author, price, thumbnail, description, categoryId]
        );
        if (!data) {
            console.log("Không đủ dữ liệu để INSERT hoặc nhập sai dữ liệu");
            return res.status(500).send({
                success: false,
                message: 'Lỗi trong câu truy vấn INSERT',
            });
        }
        res.status(201).send({
            success: true,
            message: 'Sản phẩm đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo sản phẩm',
            error,
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
const deleteProduct = async(req,res)=> {
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