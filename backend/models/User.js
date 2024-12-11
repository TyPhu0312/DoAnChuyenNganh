const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        id: {
            type: DataTypes.UUID, 
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
            allowNull: true,
            validate: {
                len: [8, 100],
            },
        },
        phone: {
            type: DataTypes.STRING, 
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