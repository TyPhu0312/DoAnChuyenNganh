const dbConnect = require("../database/db");
const crypto = require("crypto"); // Đảm bảo bạn đã import crypto
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
const getOrder = async (req, res) => {
  try {
    const data = await queryAsync(`
            SELECT o.id, o.note, o.status, o.total_amount, u.firstname AS customerName 
            FROM qlbantranh.order o
            JOIN qlbantranh.users u ON o.userId = u.id
        `);

    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order nào",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tất cả order",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Không lấy được API order",
      error: error,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy ID!",
      });
    }
    const dataWithId = await queryAsync(
      `
            SELECT o.id, o.note, o.status, o.total_amount, u.firstname AS customerName 
            FROM qlbantranh.order o
            JOIN qlbantranh.users u ON o.userId = u.id
            WHERE o.id = ?
        `,
      [id]
    );

    if (!dataWithId || dataWithId.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Không thấy data từ database",
      });
    }

    res.status(200).send({
      success: true,
      ProductDetail: dataWithId[0], // Return the first result, as we expect only one order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      note,
      status,
      userId,
      orderDetails,
      paymentMethod,
      paymentInfo,
      customerName,
      customerPhone,
      customerEmail,
      customerNote,
      customerAddress,
    } = req.body;
    const orderId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();
    const orderStatus = status || "Pending";
    let totalAmount = 0;

    orderDetails.forEach((detail) => {
      totalAmount += detail.quantity * detail.price;
    });

    // Tạo đơn hàng
    const orderData = await queryAsync(
      `INSERT INTO \`order\` (id, customerNote, status, userId, total_amount, paymentMethod, customerName, customerPhone, customerEmail, customerAddress, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())`,
      [
        orderId,
        customerNote,
        orderStatus,
        userId,
        totalAmount,
        paymentMethod,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
      ]
    );

    if (!orderData) {
      return res.status(500).send({
        success: false,
        message: "Lỗi trong câu truy vấn INSERT order",
      });
    }

    // Xử lý thông tin thanh toán tùy vào phương thức thanh toán
    if (paymentInfo && paymentMethod === "banking") {
      // Thêm thông tin thanh toán nếu là banking
      await queryAsync(
        `INSERT INTO payment_info (id, order_id, payment_method, payment_status, transaction_no, bank_code, pay_date, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?,NOW(),NOW())`,
        [
          paymentId,
          orderId,
          paymentMethod || "banking",
          "Paid",
          paymentInfo.transactionNo,
          paymentInfo.bankCode,
          paymentInfo.payDate,
        ]
      );
    } else if (paymentMethod === "cod") {
      // Thêm thông tin thanh toán nếu là COD
      await queryAsync(
        `INSERT INTO payment_info (id, order_id, payment_method, payment_status) 
             VALUES (?, ?, ?, ?)`,
        [paymentId, orderId, "COD", "Pending"]
      );
    }

    const addDetailsRes = await addOrderDetailsInternal(orderId, orderDetails);
    if (!addDetailsRes.success) {
      throw new Error(addDetailsRes.message);
    }

    res.status(201).send({
      success: true,
      message: "Order đã được tạo thành công!",
      data: { orderId, note, status: orderStatus, totalAmount, paymentMethod },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong yêu cầu API tạo order",
      error,
    });
  }
};

const addOrderDetailsInternal = async (orderId, orderDetails) => {
  try {
    const orderDetailsPromises = orderDetails.map((detail) => {
      const { productId, quantity, price } = detail;
      return queryAsync(
        `INSERT INTO \`orderdetail\` (orderId, productId, num, price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, quantity, price]
      );
    });
    await Promise.all(orderDetailsPromises);
    return {
      success: true,
      message: "Order details đã được thêm thành công!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Lỗi khi thêm chi tiết sản phẩm",
      error,
    };
  }
};
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Không tìm thấy order này",
      });
    }

    const { note, status, totalAmount } = req.body;
    if (!note || !status || totalAmount === undefined) {
      return res.status(400).send({
        success: false,
        message: "Thiếu trường thông tin bắt buộc",
      });
    }

    const data = await queryAsync(
      `UPDATE \`order\`
             SET note = ?, status = ?, total_amount = ?
             WHERE id = ?`,
      [note, status, totalAmount, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "Không có gì xảy ra ở database cả!!!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cập nhật order thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Không lấy được API update order!",
      error,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Nhận id từ tham số URL
    const { status } = req.body; // Nhận trạng thái mới từ body của request

    // Kiểm tra xem có id và status không
    if (!id || !status) {
      return res.status(400).send({
        success: false,
        message: "Thiếu id hoặc trạng thái mới!",
      });
    }

    // Cập nhật trạng thái đơn hàng
    const data = await queryAsync(
      `UPDATE \`order\` SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy đơn hàng này để cập nhật trạng thái!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong yêu cầu API cập nhật trạng thái đơn hàng!",
      error,
    });
  }
};

const deleteOrder = async (req, res) => {
  let connection; // Declare connection variable to ensure proper release
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order này",
      });
    }

    // Delete the order details first (if needed)
    const deleteOrderDetails = await queryAsync(
      `DELETE FROM \`orderdetail\` WHERE order_id = ?`,
      [id]
    );

    if (deleteOrderDetails.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order details để xoá!",
      });
    }

    // Delete the order itself
    const deleteOrder = await queryAsync(`DELETE FROM \`order\` WHERE id = ?`, [
      id,
    ]);

    if (deleteOrder.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order để xoá!",
      });
    }

    // Commit the transaction if both deletions are successful
    await connection.commit();

    res.status(200).send({
      success: true,
      message: "Xoá order và order details thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Không thể xoá order!",
      error,
    });
  }
};
const checkUserConditionForOrder = async (req, res) => {
  let connection; // Declare connection variable to ensure proper release
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order này",
      });
    }

    // Delete the order details first (if needed)
    const deleteOrderDetails = await queryAsync(
      `DELETE FROM \`orderdetail\` WHERE order_id = ?`,
      [id]
    );

    if (deleteOrderDetails.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order details để xoá!",
      });
    }

    // Delete the order itself
    const deleteOrder = await queryAsync(`DELETE FROM \`order\` WHERE id = ?`, [
      id,
    ]);

    if (deleteOrder.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order để xoá!",
      });
    }

    // Commit the transaction if both deletions are successful
    await connection.commit();

    res.status(200).send({
      success: true,
      message: "Xoá order và order details thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Không thể xoá order!",
      error,
    });
  }
};

const deleteOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy orderId này",
      });
    }

    // Start a transaction to ensure deletion is done atomically
    const connection = await queryAsync.getConnection();
    await connection.beginTransaction();

    // Delete the order details
    const deleteOrderDetails = await connection.query(
      `DELETE FROM \`orderdetail\` WHERE order_id = ?`,
      [orderId]
    );

    if (deleteOrderDetails.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order details để xoá!",
      });
    }

    // Commit the transaction
    await connection.commit();

    res.status(200).send({
      success: true,
      message: "Xoá order details thành công!",
    });
  } catch (error) {
    console.error(error);
    if (connection) await connection.rollback(); // Rollback if there's an error
    res.status(500).send({
      success: false,
      message: "Không thể xoá order details!",
      error,
    });
  } finally {
    if (connection) connection.release();
  }
};

const getCurrentYearRevenue = async (req, res) => {
  try {
    const data = await queryAsync(`
      SELECT SUM(total_amount) AS revenue
      FROM \`order\`
      WHERE YEAR(createdAt) = YEAR(NOW())
     `);

    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy order nào",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tất cả order",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Không lấy được API order",
      error: error,
    });
  }
};

const getRevenueOverYears = async (req, res) => {
  try {
    const data = await queryAsync(`
          SELECT 
              YEAR(createdAt) AS year, 
              SUM(total_amount) AS revenue
          FROM qlbantranh.order
          GROUP BY YEAR(createdAt)
          ORDER BY year DESC;
      `);

    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No revenue data available.",
      });
    }

    // Check the structure of the data being returned
    console.log("Revenue data:", data);

    res.status(200).send({
      success: true,
      message: "Revenue data fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Error fetching revenue over years:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch revenue over years.",
      error: error.message,
    });
  }
};
module.exports = {
  getRevenueOverYears,
  getCurrentYearRevenue,
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
