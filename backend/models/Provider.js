// models/Provider.js
module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define("Provider", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: "provider",
    });

    Provider.associate = (models) => {
        Provider.hasOne(models.User, {
            foreignKey: 'providerId',
            as: 'user',
        });
    };

    return Provider;
};