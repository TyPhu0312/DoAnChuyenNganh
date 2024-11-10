
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product",{
        Id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng giá trị
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
            type: DataTypes.INTEGER,
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
     
       
    };
    return Product;
}
