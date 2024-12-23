module.exports = (sequelize, DataTypes) => {
    const PaymentInfo = sequelize.define("PaymentInfo", { // Cái này giữ lại tên model không thay đổi
      id: {
        type: DataTypes.UUID,
        defaultValue: () => crypto.randomUUID(),
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Order', // Đảm bảo rằng tên bảng là 'Order'
          key: 'id',
        },
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pay_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      timestamps: true,
      tableName: "payment_info",  // Chỉ định đúng tên bảng là "payment_info"
    });
  
    PaymentInfo.associate = (models) => {
      PaymentInfo.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
        onDelete: 'CASCADE', // Xóa thông tin thanh toán nếu order bị xóa
      });
    };
  
    return PaymentInfo;
  };
  