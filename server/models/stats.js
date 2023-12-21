
//User statistics
module.exports = (sequelize, DataTypes) => {
    const Stats = sequelize.define("stats", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "cascade",
            references: { model: "users", key: "id" }
        },
        loginCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        signUpTimestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        sessionTimestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, { timestamps: true },)

    return Stats
}