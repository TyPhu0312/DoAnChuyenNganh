const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define("OrderDetail", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
            primaryKey: true,
          },
          price: {
            type: DataTypes.DECIMAL(15,0),
            allowNull: false, // Không được null
          },
          num: {
            type: DataTypes.INTEGER,
            allowNull: false, // Không được null
          },
          discount: {
            type: DataTypes.DECIMAL(5, 2), // Allows values like 15.50, 20.00, etc.
            allowNull: true, // Allows null if discount may not always be applicable
            defaultValue: 0.00, // Default to 0 if no discount is applied
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