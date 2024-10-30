module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        Id:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
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
            type: DataTypes.NUMERIC,
            allowNull: false,
            validate: {
                len: [10, 11],
            },
            unique: true,
        },
        role:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user",
            validate: {
                isIn: [['admin', 'user','employee',]],
            },
        },
        provider_id:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,

        }
    },
        {
            timestamps: true,
            tableName: "user",
        }
    )

    return User;
}