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

const getRole = async(req,res)=> {
    
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.roles'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không có data từ database"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả role hệ thống',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không thể lấy API role ',
            error: error,
        })
    }
};
const getRoleById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tim thấy Id!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.roles WHERE id =?`,[id]);
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
const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (! name) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO roles (id, name) VALUES (?, ?)`,
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
            message: 'Role đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo role',
            error,
        });
    }
};
const deleteRole = async(req,res)=> {
    try {
        const { id } = req.params; 
        //console.log("ProductId:", id);
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy role có id này',
            });
        }
        await queryAsync(
            `DELETE FROM roles 
             WHERE id = ?`, // Điều kiện WHERE
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá role thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete role!',
            error,
        });
    }
};
module.exports = { getRole, getRoleById, createRole, deleteRole };