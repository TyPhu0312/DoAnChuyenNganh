
module.exports = (sequelize, DataTypes) => {
    const CustomPainting = sequelize.define("CustomPainting",{
        id: {
            type: DataTypes.UUID,
            defaultValue: () => crypto.randomUUID(),  
            primaryKey: true,
          },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 150],
            }
        },
        link_image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 150],
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            },
        },
        size_width: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        size_height: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        picture_frame: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 500],
            },
        },
        // userId: {  // Đảm bảo trường userId là UUID và có giá trị trong bảng User
        //     type: DataTypes.UUID,
        //     allowNull: false,
        // }
    },
        {
            timestamps: true,
            tableName: "CustomPainting",
        }
    );
    CustomPainting.associate = (models) => {
        CustomPainting.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };
    return CustomPainting;
}