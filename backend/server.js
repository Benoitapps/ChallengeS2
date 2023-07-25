const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env.local', override: true });

const userRoutes = require('./routes/user');
const sdkRoutes = require('./routes/sdk');
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const trueUserRoutes = require('./routes/trueUser');
const chartRoutes = require('./routes/charts');
const GenericController = require("./controllers/generic");
const UserService = require("./services/user.js");
const kpiroutes = require("./routes/kpi");
const Heatmaproutes = require("./routes/heatmap");
const errorsHandler = require("./middleware/errorsHandler");


const tagRoutes = require('./routes/tag');
const { connect } = require('./services/mongoose');
const { connectpg } = require('./db/');

const app = express();
const sequelize = require('sequelize')

// Use to allow cross-origin requests
app.use(cors({
  origin: `${process.env.URL}:${process.env.PORT_FRONT}`,
  credentials : true,
}));

//cookies
app.use(cookieParser());
// Use to parse JSON body
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes)
app.use("/connecter", homeRoutes)
app.use("/admin", adminRoutes)
app.use("/sdk", sdkRoutes)
app.use( "/users", trueUserRoutes)
app.use("/tags", tagRoutes)
app.use("/kpi", kpiroutes)
app.use("/heatmap", Heatmaproutes)

app.use("/charts", chartRoutes)

app.use(errorsHandler);

const port = process.env.PORT_BACK;
const hostname = process.env.DOMAIN_NAME;

app.listen(port, hostname, () => {
   console.log(`Server running at ${hostname}:${port}/`);
  if (process.env.NODE_ENV !== 'test')
  connect();
});

module.exports = app;