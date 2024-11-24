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
const getCustomPainting = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.custompainting'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy custompainting nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả custompainting',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API custompainting',
            error: error,
        })
    }
};
const getCustomPaintingById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.custompainting WHERE id =?`,[id]);
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
const createCustomPainting = async (req, res) => {
    try {
        const { image, linkImage, name, size_width, size_height, picture_frame, note, userId} = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO custompainting (id, image, link_image, name, size_width, size_height, picture_frame, note, userId) VALUES (?, ?,?,?,?,?,?,?,?)`,
            [id, image, linkImage, name, size_width, size_height, picture_frame, note, userId]
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
            message: 'custompainting đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo custompainting',
            error,
        });
    }
};
const updateCustomPainting = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy sản phẩm này',
            });
        }
        const {name } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }
        const data = await queryAsync(
            `UPDATE custompainting 
             SET image = ?, link_image = ?, name = ?, size_width = ?, size_height = ?,  picture_frame = ?, note = ?, userId = ?
             WHERE id = ?`, 
             [image, linkImage, name, size_width, size_height, picture_frame, note, userId, id]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Cập nhật custompainting thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update custompainting!',
            error,
        });
    }
};
const deleteCustomPainting = async(req,res)=> {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy custompainting này',
            });
        }
        await queryAsync(
            `DELETE FROM custompainting 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá custompainting thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete custompainting!',
            error,
        });
    }
};
module.exports = { getCustomPainting, getCustomPaintingById, createCustomPainting, updateCustomPainting, deleteCustomPainting };