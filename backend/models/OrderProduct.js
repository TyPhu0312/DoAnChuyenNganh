
module.exports = (sequelize, DataTypes) => {
    const OrdeProduct = sequelize.define("OrdeProduct",{
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
       
    },
        {
            timestamps: true,
            tableName: "OrdeProduct",
        }
    );
    
    OrdeProduct.associate = (models) => {
        OrdeProduct.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        OrdeProduct.hasMany(models.Product, {
            foreignKey: 'productId',
            as: 'OrdeProduct',
        });
       
    };
        
    return OrdeProduct;
}