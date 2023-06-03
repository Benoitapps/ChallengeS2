const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const { connect } = require('./services/mongoose');

const app = express();

// Use to allow cross-origin requests
app.use(cors());
// Use to parse JSON body
app.use(express.json());

app.use("/", userRoutes)

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  connect();
});