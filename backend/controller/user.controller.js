
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
const getUser = async(req,res)=> {
    console.log("API /api/admin/user được gọi!");
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.user'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy user nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả user nè',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Lỗi lấy API user',
            error: error,
        })
    }
};
const getUserById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không thấy user này!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.user WHERE id =?`,[id]);
        if(!dataWithId) {
            return res.status(404).send({
                success: false,
                message:'Không có user mang id này',
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
const createUser = async (req, res) => {
    try {
        const {firstname, lastname, email, password, phone, providerId, roleId} = req.body;
        if (!firstname || !lastname || !email || !password || !phone || !providerId || !roleId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id  = crypto.randomUUID();
        const data = await queryAsync(
            `INSERT INTO user (id, firstname, lastname, email, password, phone, providerId, roleId) VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
            [id, firstname, lastname, email, password, phone, providerId, roleId]
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
            message: 'Người dùng đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo user',
            error,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        console.log("ProductId:", id);
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy user này',
            });
        }
        const {firstname, lastname, email, password, phone, providerId, roleId} = req.body;
        if (!firstname || !lastname || !email || !password || !phone || !providerId || !roleId) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }
        console.log("firstname:", firstname);
        const data = await queryAsync(
            `UPDATE user 
             SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, providerId = ?, roleId = ?
             WHERE id = ?`,
            [firstname, lastname, email, password, phone, providerId, roleId, id]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        else {
            res.status(200).send({
                success: true,
                message: 'Cập nhật user thành công!',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update user!',
            error,
        });
    }
};

const deleteUser = async(req,res)=> {
    try {
        const { id } = req.params; 
        //console.log("ProductId:", id);
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy user này',
            });
        }
        await queryAsync(
            `DELETE FROM user 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá user thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete user!',
            error,
        });
    }
};
module.exports = { getUser, getUserById, createUser, updateUser, deleteUser };