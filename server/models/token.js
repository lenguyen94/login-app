
//Token model
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("token", {
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

    token: {
      type: DataTypes.STRING,

    },

  }, { timestamps: true },)

  return Token
}