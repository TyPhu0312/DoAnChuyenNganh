const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        id: {
            type: DataTypes.STRING, 
            defaultValue: () => crypto.randomUUID(), 
            primaryKey: true,
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
            unique: false,
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
            unique: false,
        },
    },
    {
        indexes: [] //tắt index - tạo chỉ mục trên database để không bị quá 64key index...
    },
        {
            timestamps: true,
            tableName: "users",
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