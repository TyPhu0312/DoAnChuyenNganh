module.exports = (sequelize, DataTypes) => {
  const OrderStatus = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  });
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => crypto.randomUUID(),
      primaryKey: true,
    },
    note: {
      type: DataTypes.TEXT, 
      allowNull: true, 
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false, 
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)), 
      allowNull: false,
      defaultValue: OrderStatus.PENDING, //  mặc định là pending
    },
  }, {
    timestamps: true,
    tableName: "Order",
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Order.hasMany(models.OrderDetail, {
      foreignKey: 'orderId',
      as: 'orderDetail',
    });
  };
  return Order;
};
