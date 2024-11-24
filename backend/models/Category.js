module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category",{
        id: {
            type: DataTypes.UUID,
            defaultValue: () => crypto.randomUUID(),  
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