const dbConnect = require('../database/db')
const crypto = require('crypto');
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
const getCustomPainting = async (req, res) => {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.custompainting'); //
        if (!data) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy custompainting nào"
            })
        }
        res.status(200).send({
            success: true,
            message: 'Tất cả custompainting',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Không lấy được API custompainting',
            error: error,
        })
    }
};
const getCustomPaintingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT 
        cp.*, 
        CONCAT(u.firstname, ' ', u.lastname) AS userName
        FROM 
        qlbantranh.custompainting cp
        JOIN 
        qlbantranh.users u ON cp.userId = u.id
        WHERE 
        cp.id = ?;
        `, [id]);
        if (!dataWithId) {
            return res.status(404).send({
                success: false,
                message: 'Không thấy data từ database',
            });
        }
        res.status(200).send({
            success: true,
            data: dataWithId
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
const getCustomPaintingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("da chay den day"),
        console.log(id)
        if (!id || id.trim()==="") {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy ID người dùng!'
            });
        }
        else {
            const data = await queryAsync(
                `SELECT cp.id, cp.name, cp.createdAt, cp.updatedAt
                 FROM qlbantranh.custompainting AS cp
                 JOIN qlbantranh.users AS u ON cp.userId = u.id
                 WHERE u.id = ?`, 
                [id]
            );
            console.log(data)
            // if (!data || data.length === 0) {
            //     return res.status(404).send({
            //         success: false,
            //         message: 'Không có đơn đặt vẽ tranh nào trong database.',
            //     });
            // }
    
            res.status(200).send({
                success: true,
                message: 'Tạo yêu cầu đặt tranh thành công.',
                data: data,
            });
        }

       

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};
const fs = require('fs');
const createCustomPainting = async (req, res) => {
    try {
        const {name, size_width, size_height, picture_frame, note, userId } = req.body;

        if (!name||!userId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
      
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please upload a thumbnail image.",
            });
        }
        // Lấy thông tin file từ multer
        const image = req.file.filename; // Lấy tên file
        const backendPath = path.join(__dirname, '../public/images', image); // File đã lưu ở backend
        const frontendPath = path.join(__dirname, '../../frontend/public/images', image); // Đường dẫn lưu ở frontend

        // Sao chép file từ backend sang frontend
        if (!fs.existsSync(path.dirname(frontendPath))) {
            fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
        }
        fs.copyFileSync(backendPath, frontendPath);
        fs.unlinkSync(backendPath);
        const id = crypto.randomUUID();
        const data = await queryAsync(
            `INSERT INTO custompainting (id, image,name,size_width,size_height,picture_frame,note,userId) VALUES (?,?,?,?,?,?,?,?)`,
            [id,image, name, size_width, size_height, picture_frame, note, userId]
        );
        if (!data) {
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
        const { name, image, size_width, size_height, picture_frame, note } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }
        const data = await queryAsync(
            `UPDATE custompainting 
             SET image = ?,  name = ?, size_width = ?, size_height = ?,  picture_frame = ?, note = ?
             WHERE id = ?`,
            [image, name, size_width, size_height, picture_frame, note, id]
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
const deleteCustomPainting = async (req, res) => {
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

const updatePaintingStatus = async (req, res) => {
    const { id } = req.params;  // Lấy id của bức tranh từ tham số URL
    const { status } = req.body;  // Lấy status từ body của yêu cầu
  
    try {
      // Kiểm tra xem trạng thái có hợp lệ không
      const validStatuses = ["processing", "completed", "cancelled", "pending"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }
  
      // Câu lệnh SQL cập nhật trạng thái của bức tranh
      const data = await queryAsync(
        `UPDATE custompainting 
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );
  
      if (data === 0) {
        // Nếu không có bức tranh nào được cập nhật
        return res.status(404).json({ message: "Không tìm thấy bức tranh với id này" });
      }
  
      // Thành công, trả về thông báo thành công
      res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      // Trả về lỗi server nếu có sự cố
      res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
    }
  };

module.exports = {getCustomPaintingByUser,updatePaintingStatus, getCustomPainting, getCustomPaintingById, createCustomPainting, updateCustomPainting, deleteCustomPainting };