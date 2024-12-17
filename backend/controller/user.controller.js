const validator = require('validator')
const dbConnect = require('../database/db')

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
const getUser = async (req, res) => {
    try {
        const data = await queryAsync(`
    SELECT 
        users.firstname, 
        users.lastname, 
        users.email, 
        users.phone,
        roles.name AS roleName, 
        provider.name AS providerName
    FROM 
        users
    LEFT JOIN 
    roles ON users.roleId = roles.id
    LEFT JOIN 
        provider ON users.providerId = provider.id
`);

        if (!data) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy user nào"
            })
        }
        res.status(200).send({
            success: true,
            message: 'Tất cả user nè',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Lỗi lấy API user',
            error: error,
        })
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Không thấy user này!'
            });
        }

        const dataWithId = await queryAsync(`
                SELECT 
                users.firstname, 
                users.lastname, 
                users.email, 
                users.phone,
                roles.name AS roleName, 
                provider.name AS providerName
            FROM 
                users
            LEFT JOIN 
            roles ON users.roleId = roles.id
            LEFT JOIN 
                provider ON users.providerId = provider.id
        
        WHERE users.id =?`, [id]);
        if (!dataWithId || dataWithId.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Không có user mang id này',
            });
        }
        res.status(200).send({
            success: true,
            ProductDetail: dataWithId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const checkUserForOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'ID người dùng không hợp lệ!'
            });
        }

        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.users WHERE id =?`, [id]);
        if (!dataWithId || dataWithId.length === 0) {
            return res.status(200).send({
                success: false,
                message: 'Không có người dùng trong hệ thống, vui lòng cập nhật thông tin!'
            });
        }

        res.status(200).send({
            success: true,
            ProductDetail: dataWithId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createUser = async (req, res) => {
    try {
        const { id, firstname, lastname, email, phone, address, providerId, roleId, password = null } = req.body;
        if (!id || !firstname || !lastname || !email || !phone || !address || !providerId || !roleId) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }
        //const id = crypto.randomUUID();
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                success: false,
                message: "Email không hợp lệ",
            });
        }
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Phone number must contain only digits' });
        }
        const data = await queryAsync(
            `INSERT INTO users (id, firstname, lastname, email, phone, address, providerId, roleId, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [id, firstname, lastname, email, phone, address, providerId, roleId, password]
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
        const { firstname, lastname, email, password, phone, address, providerId, roleId } = req.body;
        if (!firstname || !lastname || !email || !phone || !address || !providerId || !roleId) {
            return res.status(400).send({
                success: false,
                message: 'Nhập thiếu trường dữ liệu',
            });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                success: false,
                message: "Email không hợp lệ",
            });
        }
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            return res
                .status(400)
                .json({ error: "Phone number must contain only digits" });
        }
        const data = await queryAsync(
            `UPDATE users 
             SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, address = ? , providerId = ?, roleId = ?
             WHERE id = ?`,
            [firstname, lastname, email, password, phone, address, providerId, roleId, id]
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

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
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

module.exports = { getUser, getUserById, createUser, updateUser, deleteUser, checkUserForOrder };