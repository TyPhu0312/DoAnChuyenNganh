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
const getOrderDetail = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.orderdetail'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"Không tìm thấy orderdetail nào"
            })
        }
        res.status(200).send({
            success:true,
            message:'Tất cả orderdetail',
            data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Không lấy được API orderdetail',
            error: error,
        })
    }
};
const getOrderDetailById = async(req,res)=> {
    try {
        const {id} = req.params; 
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.orderdetail WHERE id =?`,[id]);
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
const getOrderDetailByorderId = async(req,res)=> {
    const {id} = req.params; 
    try {
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Không tìm thấy order ID!'
            })
        }
        const data = await queryAsync(`SELECT * FROM qlbantranh.orderdetail WHERE orderId =?`,[id]);
        if(!data) {
            return res.status(404).send({
                success: false,
                message:'Không thấy data từ database',
            });
        }    
        res.status(200).send({
            success: true,
            data
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const createOrderDetail = async (req, res) => {
    try {
        const { price, num, discount, orderId, productId } = req.body;
        if (!price || !num || !discount || !orderId || !productId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
         // Kiểm tra orderId có tồn tại
         const orderExists = await queryAsync(`SELECT id FROM \`order\` WHERE id = ?`, [orderId]);
         if (orderExists.length === 0) {
             return res.status(400).send({
                 success: false,
                 message: "orderId không tồn tại",
             });
         }
         // Kiểm tra productId có tồn tại
        const productExists = await queryAsync(`SELECT id FROM product WHERE id = ?`, [productId]);
        if (productExists.length === 0) {
            return res.status(400).send({
                success: false,
                message: "productId không tồn tại",
            });
        }
        const id = crypto.randomUUID(); 
        const data = await queryAsync(
            `INSERT INTO \`orderdetail\` (id, price, num, discount, orderId, productId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,NOW(),NOW())`,
            [id, price, num, discount, orderId, productId]
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
            message: 'orderdetail đã được tạo thành công!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo orderdetail',
            error,
        });
    }
};
const updateOrderDetail = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Không tìm thấy orderdetail này',
            });
        }
        const { price, num, discount, orderId, productId } = req.body;
        if (!price || !num || !discount || !orderId || !productId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        
        // Kiểm tra orderId có tồn tại
        const orderExists = await queryAsync(`SELECT id FROM \`order\` WHERE id = ?`, [orderId]);
        if (orderExists.length === 0) {
            return res.status(400).send({
                success: false,
                message: "orderId không tồn tại",
            });
        }
        // Kiểm tra productId có tồn tại
        const productExists = await queryAsync(`SELECT id FROM product WHERE id = ?`, [productId]);
        if (productExists.length === 0) {
            return res.status(400).send({
                success: false,
                message: "productId không tồn tại",
            });
        }

        const data = await queryAsync(
            `UPDATE orderdetail 
             SET price = ?, num = ?, discount = ?, orderId = ?, productId = ?,
             WHERE id = ?`, 
             [id, price, num, discount, orderId, productId]
        );
        if (data.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có gì xảy ra ở database cả!!!',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Cập nhật orderdetail thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API update orderdetail!',
            error,
        });
    }
};
const deleteOrderDetail = async(req,res)=> {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy orderdetail này',
            });
        }
        await queryAsync(
            `DELETE FROM orderdetail 
             WHERE id = ?`,
            [id]
        );
        res.status(200).send({
            success: true,
            message: 'Xoá orderdetail thành công!',
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Không lấy được API delete orderdetail!',
            error,
        });
    }
};
module.exports = {getOrderDetailByorderId, getOrderDetail, getOrderDetailById, createOrderDetail, updateOrderDetail, deleteOrderDetail };