
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
const userRoutes = require('./routes/api_routes')

initializePassport(passport);

//assigning the variable app to express
const app = express()



//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRETKEY
}));

app.use(passport.session());

//synchronizing the database. Forcing it to false to keep the data
db.sequelize.sync({ force: false }).then(() => {
  console.log("db has been re sync")
})

app.get('/', (req, res) => {
  res.send('server')
})

//routes for the user API
app.use('/api/users', userRoutes)

//listening to server connection
app.listen(process.env.PORT, () => console.log(`Server is connected on http://localhost:${process.env.PORT}/`))
