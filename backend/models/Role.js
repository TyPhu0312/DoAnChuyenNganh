const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // This will automatically generate a UUID for the id
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
        timestamps: true,
        tableName: "role",
    });

    Role.associate = (models) => {
        Role.hasMany(models.User, {
            foreignKey: 'roleId',
            as: 'users',
        });
    };
       
    // Function to generate a random ID
    async function generateUniqueId() {
        const letters = Array.from({ length: 4 }, () => {
            const isUpperCase = Math.random() > 0.5; // Randomly choose upper or lowercase
            const charCode = isUpperCase
                ? 65 + Math.floor(Math.random() * 26) // Uppercase A-Z
                : 97 + Math.floor(Math.random() * 26); // Lowercase a-z
            return String.fromCharCode(charCode);
        }).join('');

        const digits = Math.floor(100000 + Math.random() * 900000); // 6 random digits
        return `${letters}${digits}`;
    }

    // Hook to generate a unique alphanumeric ID
    Role.beforeCreate(async (role, options) => {
        let uniqueId;
        let isUnique = false;

        while (!isUnique) {
            uniqueId = await generateUniqueId();
            // Check if the generated ID already exists in the database
            const existingRole = await Role.findOne({ where: { id: uniqueId } });
            if (!existingRole) {
                isUnique = true; // No duplicate found, the ID is unique
            }
        }

        role.id = uniqueId; // Set the unique ID
    });

    return Role;
};