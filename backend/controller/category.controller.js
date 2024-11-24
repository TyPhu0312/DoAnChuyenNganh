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
const getCategory = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.category'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy category nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả category',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API category',
            error: error,
        })
    }
};
const getCategoryById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.category WHERE id =?`,[id]);
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
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO category (id, name) VALUES (?, ?)`,
            [id, name]
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
            message: 'Category đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo Category',
            error,
        });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params; 
        console.log("ID nhận được:", id);
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy category này',
            });
        }
        
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }

        // Kiểm tra xem category có tồn tại với ID này không
        const categoryCheck = await queryAsync('SELECT * FROM category WHERE id = ?', [id]);
        if (categoryCheck.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Category không tồn tại',
            });
        }

        console.log("Name nhận được:", name);

        // Thực hiện update category
        const data = await queryAsync(
            `UPDATE category SET name = ? WHERE id = ?`, 
            [name, id]
        );

        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì thay đổi ở database cả (có thể tên mới trùng với tên cũ)!',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Cập nhật category thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update category!',
            error,
        });
    }
};

const deleteCategory = async(req,res)=> {
    try {
        const { id } = req.params; 
        //console.log("ProductId:", id);
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy category này',
            });
        }
        await queryAsync(
            `DELETE FROM category 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá category thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete category!',
            error,
        });
    }
};
module.exports = { getCategory, getCategoryById, createCategory, updateCategory, deleteCategory };