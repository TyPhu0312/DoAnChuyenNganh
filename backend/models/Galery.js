module.exports = (sequelize,DataTypes) => {
    const Galery = sequelize.define("Galery",{
        Id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng giá trị
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 500],
            }
        },
    },
    {
        timestamps: true,
        tableName: "galery",
    });
    Galery.associate = (models) => {
        Galery.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product_gal',
        });
    };
    
    return Galery;
};