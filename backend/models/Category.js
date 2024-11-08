const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category",{
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
            primaryKey: true,
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            }
        },
    },
        {
            timestamps: true,
            tableName: "category",
        }
    )
    return Category;
}