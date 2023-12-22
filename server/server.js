
//importing modules
require("dotenv").config();
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const db = require('./models')
const passport = require("passport");
const cors = require('cors')
const session = require('express-session');

const initializePassport = require("./controllers/passportController");
const userRoutes = require ('./routes/api_routes')

initializePassport(passport);

//assigning the variable app to express
const app = express()

app.use(
  cors({
   credentials: true,
   origin: true,
  })
 );

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(helmet())

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRETKEY
}));

app.use(passport.session());

////synchronizing the database. Forcing it to false to keep the data
// db.sequelize.sync({ force: true }).then(() => {
// db.sequelize.sync().then(() => {
//     console.log("db has been re sync")
// })

//routes for the user API
app.use('/api/users', userRoutes)

//listening to server connection
app.listen(process.env.PORT, () => console.log(`Server is connected on http://localhost:${process.env.PORT}/`))
