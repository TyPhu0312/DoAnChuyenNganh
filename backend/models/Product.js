const { v4: uuidv4 } = require('uuid');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 300],
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                len:[1,300],
            }
        },
        price: {
            type: DataTypes.DECIMAL(15,0),
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 500],
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1, 500],
            },
        },
    },
        {
            timestamps: true,
            tableName: "product",
        }
    );
    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category_pro',
        });
        Product.hasMany(models.OrderDetail, {
            foreignKey: 'productId',
            as: 'orderDetail',
        });
        Product.hasMany(models.OrderDetail, {
            foreignKey: 'productId',
            as: 'orderDetail',
        });
       
    };
    
    
    
    
    return Product;
}
