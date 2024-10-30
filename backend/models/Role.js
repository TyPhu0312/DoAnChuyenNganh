module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: true,
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