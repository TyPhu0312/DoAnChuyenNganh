const dbConnect = require('../database/db');
require('dotenv').config(); 
const jwt = require('jsonwebtoken');

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

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Lấy người dùng từ cơ sở dữ liệu
        const users = await queryAsync(`
            SELECT u.*, r.name AS role_name
            FROM Users u
            JOIN Roles r ON u.roleId = r.id
            WHERE u.email = ?`, [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }

        if (user.role_name !== 'admin') {
            return res.status(403).json({ message: 'Truy cập bị từ chối! Bạn không có quyền admin.' });
        }

        // Tạo token JWT và trả về cho người dùng
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_name }, 
            process.env.JWT_SECRET,  
            { expiresIn: '1h' }  
        );

        // Trả về thông tin người dùng và token
        res.status(200).json({
            status: true,
            success: 'Đăng nhập thành công!',
            user,
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng nhập' });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ status: true, success: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { login, logout };
