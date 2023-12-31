
//User model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, //checks for email format
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, { timestamps: true, },)

    return User
}