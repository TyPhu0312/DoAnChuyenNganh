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
    fullname: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, 
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    note: {
      type: DataTypes.TEXT, 
      allowNull: true, 
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
