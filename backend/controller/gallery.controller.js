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
const getGallery = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.gallery'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy gallery nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả gallery',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API gallery',
            error: error,
        })
    }
};
const getGalleryById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.gallery WHERE id =?`,[id]);
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
const createGallery = async (req, res) => {
    try {
        const { thumbnail } = req.body;
        if (!thumbnail) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO gallery (id, thumbnail) VALUES (?,?)`,
            [id,thumbnail]
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
            message: 'gallery đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo gallery',
            error,
        });
    }
};
const updateGallery = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy gallery này',
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
            `UPDATE gallery 
             SET thumbnail = ?
             WHERE id = ?`, 
             [thumbnail, id]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Cập nhật gallery thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update gallery!',
            error,
        });
    }
};
const deleteGallery = async(req,res)=> {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy gallery này',
            });
        }
        await queryAsync(
            `DELETE FROM gallery 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá gallery thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete gallery!',
            error,
        });
    }
};
module.exports = { getGallery, getGalleryById, createGallery, updateGallery, deleteGallery };