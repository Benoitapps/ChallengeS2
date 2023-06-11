const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const sdkRoutes = require('./routes/sdk');
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const { connect } = require('./services/mongoose');

const app = express();

// Use to allow cross-origin requests
app.use(cors());
// Use to parse JSON body
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes)
app.use("/connecter", homeRoutes)
app.use("/admin", adminRoutes)
app.use("/sdk", sdkRoutes)

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  connect();
});