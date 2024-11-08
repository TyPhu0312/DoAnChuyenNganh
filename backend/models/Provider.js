// models/Provider.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define("Provider", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
            primaryKey: true,
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