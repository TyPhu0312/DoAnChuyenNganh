
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng giá trị
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