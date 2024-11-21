const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        id: {
            type: DataTypes.STRING, 
            defaultValue: () => crypto.randomUUID(), 
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    },
    {
        indexes: [] //tắt index - tạo chỉ mục trên database để không bị quá 64key index...
    },
    {
        timestamps: false,
        tableName: "role",
    });

    Role.associate = (models) => {
        Role.hasMany(models.User, {
            foreignKey: 'roleId',
            as: 'users',
        });
    };
    return Role;
};