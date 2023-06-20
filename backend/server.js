const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const UserService = require("./services/user.js");
const userRoutes = require('./routes/user');
const sdkRoutes = require('./routes/sdk');
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const { connect } = require('./services/mongoose');
const { connectpg } = require('./db/');

const app = express();
const sequelize = require('sequelize')


// Use to allow cross-origin requests
app.use(cors({
  origin: "http://localhost:5173",
  credentials : true
}));
//cookies
app.use(cookieParser("secret"));
// Use to parse JSON body
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes)
app.use("/connecter", homeRoutes)
app.use("/admin", adminRoutes)
app.use("/sdk", sdkRoutes)

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  if (process.env.NODE_ENV !== 'test')
  connect();
});

module.exports = app;