
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng
          },
          fullname: {
            type: DataTypes.STRING,
            allowNull: false, // Không được null
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false, // Không được null
            validate: {
              isEmail: true, // Kiểm tra định dạng email
            },
          },
          phone_number: {
            type: DataTypes.STRING,
            allowNull: false, // Không được null
          },
          address: {
            type: DataTypes.STRING,
            allowNull: false, // Không được null
          },
          note: {
            type: DataTypes.TEXT, // Cho phép ghi chú dài
            allowNull: true, // Có thể null
          },
          // list_product: {
          //   type: DataTypes.JSON, // Sử dụng JSON để lưu mảng
          //   allowNull: true,
        // },
          status: {
            type: DataTypes.INTEGER, // Kiểu số nguyên cho trạng thái đơn hàng
            allowNull: false, // Không được null
            defaultValue: 0, // Giá trị mặc định, có thể là pending
          },
        
       
    },
        {
            timestamps: true,
            tableName: "Order",
        }
    );
    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
     
      
    };
    
        
    return Order;
}