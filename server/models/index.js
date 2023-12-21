//importing modules
const { Sequelize, DataTypes } = require('sequelize')
// require('dotenv').config()


//database connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const sequelize = new Sequelize(connectionString)

sequelize.authenticate().then(() => {
  console.log(`Database connected to ${connectionString} `)
}).catch((err) => {
  console.log(err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel')(sequelize, DataTypes)
db.tokens = require('./token')(sequelize, DataTypes)
db.stats = require('./stats')(sequelize, DataTypes)

db.users.hasOne(db.tokens, {
  foreignKey: "userId"
})

db.tokens.belongsTo(db.users, {
  foreignKey: "userId"
})

db.users.hasOne(db.stats, {
  foreignKey: "userId"
})


db.stats.belongsTo(db.users, {
  foreignKey: "userId"
})

module.exports = db

