//const User2 = require('../models/User');
//const User = require('../db/models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const authMiddleware = require('../middleware/authMiddleware');
// const services = '../services/user'
// const User = require("../db").User;
// const Usertracker = require('../models/Usertracker');
 
  function getSDK(req, res) {
    // renvoyer le sdk stocké dans le dossier utils
    try {
      res.status(200).sendFile('utils/sdk.js', { root: './' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  module.exports = { getSDK };