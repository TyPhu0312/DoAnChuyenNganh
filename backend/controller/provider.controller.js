const dbConnect = require("../database/db");
const crypto = require("crypto");
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
const getProvider = async (req, res) => {
  try {
    const data = await queryAsync("SELECT * FROM qlbantranh.provider");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy provider nào",
      });
    }
    res.status(200).send({
      success: true,
      message: "Tất cả provider",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Không lấy được API provider",
      error: error,
    });
  }
};
const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy ID!",
      });
    }
    const dataWithId = await queryAsync(
      `SELECT * FROM qlbantranh.provider WHERE id =?`,
      [id]
    );
    if (!dataWithId) {
      return res.status(404).send({
        success: false,
        message: "Không thấy data từ database",
      });
    }
    res.status(200).send({
      success: true,
      ProductDetail: dataWithId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createProvider = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Thiếu trường thông tin bắt buộc",
      });
    }
    const id = crypto.randomUUID();
    const data = await queryAsync(
      `INSERT INTO provider (id, name) VALUES (?,?)`,
      [id, name]
    );
    if (!data) {
      console.log("Không đủ dữ liệu để INSERT hoặc nhập sai dữ liệu");
      return res.status(500).send({
        success: false,
        message: "Lỗi trong câu truy vấn INSERT",
      });
    }
    res.status(201).send({
      success: true,
      message: "provider đã được tạo thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong yêu cầu API tạo provider",
      error,
    });
  }
};
const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Thiếu ID trong request",
      });
    }
    const providerCheck = await queryAsync(
      `SELECT * FROM qlbantranh.provider WHERE id = ?`,
      [id]
    );
    if (providerCheck.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy provider với ID này!",
      });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Thiếu trường thông tin bắt buộc",
      });
    }
    const data = await queryAsync(
      `UPDATE provider 
             SET name =? 
             WHERE id = ?`,
      [name, id]
    );
    if (data.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "Không có gì xảy ra ở database cả!!!",
      });
    }
    res.status(200).send({
      success: true,
      message: "Cập nhật provider thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Không lấy được API update provider!",
      error,
    });
  }
};
const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy provider này",
      });
    }
    await queryAsync(
      `DELETE FROM provider 
             WHERE id = ?`,
      [id]
    );
    res.status(200).send({
      success: true,
      message: "Xoá provider thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Không lấy đượ c API delete provider!",
      error,
    });
  }
};
module.exports = {
  getProvider,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
};
