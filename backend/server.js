const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const sdkRoutes = require('./routes/sdk');
const { connect } = require('./services/mongoose');

const app = express();

// Use to allow cross-origin requests
app.use(cors());
// Use to parse JSON body
app.use(express.json());
app.use(express.text());

app.use("/", userRoutes)
app.use("/sdk", sdkRoutes)

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  if (process.env.NODE_ENV !== 'test')
    connect();
});

module.exports = app;