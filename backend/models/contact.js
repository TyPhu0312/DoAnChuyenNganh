
module.exports = (sequelize, DataTypes) => {
    const Contacts = sequelize.define("Contacts",{
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 150],
            }
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 500],
            },
        },
        createAt:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: sequelize.NOW,
        },
        price:{
            type: DataTypes.DECIMAL(15,0),
            allowNull:true
        }
    },
    );
    Contacts.associate = (models) => {
        Contacts.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Contacts.belongsTo(models.CustomPainting, {
            foreignKey: 'custompaintingId',
            as: 'Custompainting',
        });
    };
    return Contacts;
}