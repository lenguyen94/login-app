# login-app
 

## Description:

- Full stack client-server login with JWT, Authorization, and Google login
- Working example on https://client-ln.fly.dev/
- To test backend server API via postman/..., run all the api call https://server-ln.fly.dev/


## Requirements:

- Node.js (backend)
- React (Front end)
- Postgres 16 (DB)

### Notable library used:

- passportjs for google auth
- nodemailer for email
- sequelize for db 
- jwt for token


## Installation

Navigate to both /client and /server:
- create .env file based on .env-example
- `npm install`
- `npm start`  


## Known issue

- client side authenticate via Bearer Token instead of cookie, while api backend accept both
- slow database connection for the test server above
- no error handler on the client side
