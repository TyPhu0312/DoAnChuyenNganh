const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize,DataTypes) => {
    const Gallery = sequelize.define("Gallery",{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
            primaryKey: true,
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
        tableName: "gallery",
    });
    Gallery.associate = (models) => {
        Gallery.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product_gal',
        });
    };
    

    
    return Gallery;
};