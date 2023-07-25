//const User2 = require('../models/User');
//const User = require('../db/models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const authMiddleware = require('../middleware/authMiddleware');
// const services = '../services/user'
// const User = require("../db").User;
// const Usertracker = require('../models/Usertracker');
 
function getConnectedUserId(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;

    if (!token) {
      reject(new Error('Token not found'));
    }

    try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userToken = decoded.userToken;

      resolve(userToken);
    } catch (error) {
      reject(new Error('Invalid token'));
    }
  });
}

  function updateToken(req, res) {
    /* utiliser l'utilisateur connecté récupéré dans la fonction getConnectedUserId pour mettre à jour le token de l'utilisateur dans la base de données mongdb puis postresql */
    try {
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }

  }

  module.exports = { updateToken };