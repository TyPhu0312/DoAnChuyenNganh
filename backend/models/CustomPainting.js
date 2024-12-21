
module.exports = (sequelize, DataTypes) => {
    const CustomPaintingStatus = Object.freeze({
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
      });
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 500],
            },
        },
        status: {
            type: DataTypes.ENUM(...Object.values(CustomPaintingStatus)), 
            allowNull: false,
            defaultValue: CustomPaintingStatus.PENDING, //  mặc định là pending
          },
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