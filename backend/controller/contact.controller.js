const dbConnect = require('../database/db')
const crypto = require('crypto');
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

const getContact = async(req,res) =>{
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.contact'); //
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
}

const getContactByUserIdAndPaintingId = async (req, res) => {
    try {
        const { userId, customPaintingId } = req.params;

        // Kiểm tra xem các tham số có hợp lệ không
        if (!userId || !customPaintingId) {
            return res.status(400).send({
                success: false,
                message: 'Thiếu userId hoặc customPaintingId!',
            });
        }

        // Truy vấn cơ sở dữ liệu với cả userId và customPaintingId
        const data = await queryAsync(
            `SELECT * FROM qlbantranh.contact WHERE userId = ? AND custompaintingId = ?`,
            [userId, customPaintingId]
        );

        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy dữ liệu trong cơ sở dữ liệu!',
            });
        }

        // Trả về kết quả
        res.status(200).send({
            success: true,
            Contact: data,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const fs = require('fs');
const createContact = async (req, res) => {
    try {
        const { userId, customPaintingId, note, price = null,name } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !customPaintingId) {
            return res.status(400).send({
                success: false,
                message: 'userId và customPaintingId là bắt buộc!',
            });
        }

        if (req.file) {
            const image = req.file.filename; // Lấy tên file
            const backendPath = path.join(__dirname, '../public/images', image); // File đã lưu ở backend
            const frontendPath = path.join(__dirname, '../../frontend/public/images', image); // Đường dẫn lưu ở frontend

            // Sao chép file từ backend sang frontend
            if (!fs.existsSync(path.dirname(frontendPath))) {
                fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
            }
            fs.copyFileSync(backendPath, frontendPath);
            fs.unlinkSync(backendPath);
        }

        const id = crypto.randomUUID();
        // Tạo một Contact mới
        const data = await queryAsync(
            `INSERT INTO contact (id, image,name,note,userId,price,createAt) VALUES (?,?,?,?,?,?,NOW())`,
            [id,image, name, note, userId, price]
        );
        if (!data) {
            return res.status(500).send({
                success: false,
                message: 'Lỗi trong câu truy vấn INSERT',
            });
        }
        // Phản hồi nếu thành công
        res.status(201).send({
            success: true,
            message: 'Tạo Contact thành công!',
            contact: newContact,
        });
    } catch (error) {
        // Phản hồi nếu xảy ra lỗi
        res.status(500).send({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo Contact.',
            error: error.message,
        });
    }
};
const updateContact = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const { image, note, price } = req.body; // Lấy dữ liệu cần cập nhật từ body

        // Kiểm tra xem ID có tồn tại không
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'ID là bắt buộc!',
            });
        }

        // Tìm và cập nhật Contact
        const [updated] = await Contacts.update(
            { image, note, price },
            { where: { id } }
        );

        // Kiểm tra kết quả cập nhật
        if (!updated) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy Contact để cập nhật!',
            });
        }

        // Phản hồi thành công
        res.status(200).send({
            success: true,
            message: 'Cập nhật Contact thành công!',
        });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).send({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật Contact.',
            error: error.message,
        });
    }
};
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL

        // Kiểm tra xem ID có tồn tại không
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'ID là bắt buộc!',
            });
        }

        // Tìm và xóa Contact
        const deleted = await Contacts.destroy({ where: { id } });

        // Kiểm tra kết quả xóa
        if (!deleted) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy Contact để xóa!',
            });
        }

        // Phản hồi thành công
        res.status(200).send({
            success: true,
            message: 'Xóa Contact thành công!',
        });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).send({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa Contact.',
            error: error.message,
        });
    }
};



module.exports = { getContact, getContactByUserIdAndPaintingId, createContact, updateContact, deleteContact };
