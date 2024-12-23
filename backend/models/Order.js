module.exports = (sequelize, DataTypes) => {
  const OrderStatus = Object.freeze({
    PENDING: "pending",
    PAID:"paid",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  });

  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => crypto.randomUUID(),
        primaryKey: true,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.PENDING, // mặc định là pending
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      customerAddress: {
        type:DataTypes.STRING,
        allowNull:false,
      },
      customerNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "Order",
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Order.hasMany(models.OrderDetail, {
      foreignKey: "orderId",
      as: "orderDetail",
    });
    Order.hasOne(models.PaymentInfo, {
      foreignKey: "order_id",
      as: "paymentInfo",
    });
  };

  return Order;
};
