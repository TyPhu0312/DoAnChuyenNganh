module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define("OrderDetail", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng
          },
          price: {
            type: DataTypes.INTEGER,
            allowNull: false, // Không được null
          },
          num: {
            type: DataTypes.INTEGER,
            allowNull: false, // Không được null
          },
          total_money: {
            type: DataTypes.INTEGER,
            allowNull: false, // Không được null
          },
    }, {
        timestamps: true,
        tableName: "OrderDetail",
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order',
        });

       
       
    };

    return OrderDetail;
};