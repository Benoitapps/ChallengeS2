//const User2 = require('../models/User');
//const User = require('../db/models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const authMiddleware = require('../middleware/authMiddleware');
// const services = '../services/user'
// const User = require("../db").User;
// const Usertracker = require('../models/Usertracker');

require('dotenv').config({ path: '../.env.local', override: true });
const fs = require('fs');
const ejs = require('ejs');

function getSDK(req, res) {
  try {
    const originalSDK = fs.readFileSync('./utils/sdk.js', 'utf8');
    const compiledSDK = ejs.render(originalSDK, process.env);
    res.setHeader('Content-disposition', 'attachment; filename=sdk.js');
    res.setHeader('Content-type', 'application/javascript');
    res.send(compiledSDK);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getSDK };