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
const getOrder = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.order'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy order nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả order',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API order',
            error: error,
        })
    }
};
const getOrderById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.order WHERE id =?`,[id]);
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
const createOrder = async (req, res) => {
    try {
        const { fullname, email, phone, address, note, status, userId } = req.body;
        if (!email || !fullname || !phone || !address || !note || !status || !userId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO order (id, fullname, email, phone_number, address, note, status, userId) VALUES (?,?,?,?,?,?,?,?)`,
            [id, fullname, email, phone, address, note, status, userId]
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
            message: 'order đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo order',
            error,
        });
    }
};
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy order này',
            });
        }
        const { fullname, email, phone, address, note, status } = req.body;
        if (!email || !fullname || !phone || !address || !note || !status) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const data = await queryAsync(
            `UPDATE order 
             SET fullname = ?, email = ?, phone_number = ?, address = ?, note = ?, status = ? 
             WHERE id = ?`, 
             [fullname, email, phone, address, note, status, id]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Cập nhật order thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update order!',
            error,
        });
    }
};
const deleteOrder = async(req,res)=> {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy order này',
            });
        }
        await queryAsync(
            `DELETE FROM order 
             WHERE id = ?`,
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá order thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete order!',
            error,
        });
    }
};
module.exports = { getOrder, getOrderById, createOrder, updateOrder, deleteOrder };