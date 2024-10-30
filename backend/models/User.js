module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Tự động tăng giá trị
          },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: true,
            isLowercase: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 100],
            },
        },
        phone: {
            type: DataTypes.STRING, // Thay đổi từ NUMERIC sang STRING để kiểm soát độ dài
            allowNull: false,
            validate: {
                len: [10, 11],
            },
            unique: true,
        },
    },
        {
            timestamps: true,
            tableName: "user",
        }
    );
    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'role',
        });

        User.belongsTo(models.Provider, {
            foreignKey: 'providerId',
            as: 'provider',
        });
        
    };
    return User;
}