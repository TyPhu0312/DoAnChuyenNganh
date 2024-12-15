module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define("OrderDetail", {
      price: {
          type: DataTypes.DECIMAL(15, 0),
          allowNull: false, 
      },
      num: {  
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      discount: {
          type: DataTypes.DECIMAL(5, 2), 
          allowNull: true, 
          defaultValue: 0.00, 
      },
      // total_money: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false, // Không được null
      // },
  }, {
      timestamps: true,
      tableName: "OrderDetail",
  });
  return OrderDetail;
};
