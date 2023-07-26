const mongoose = require('mongoose');
const Usertracker = require('../models/Usertracker');
const UserService = require('../services/user');
const { User } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");


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

async function updateToken(req, res) {
  try {
    console.log('updateToken called');
    const { id } = req.params;
    const { oldToken, newToken } = req.body;

    console.log('oldToken :', oldToken);
    console.log('newToken :', newToken);
    console.log(req.body);
    const result = await Usertracker.updateMany(
      { api_token: oldToken },
      { $set: { api_token: newToken } }
    );
    console.log('result :', result);

    if (result.modifiedCount === 0) {
      console.log('Aucun document trouvé avec l\'ancien token');
      return res.status(404).json({ error: 'Aucun document trouvé avec l\'ancien token' });
    }

    console.log('Mise à jour (Mongo) réussie');
    console.log('Mise à jour (Postgres) en cours');

    const [nbUpdated, users] = await User.update({ api_token: newToken }, {
      where: { id: id },
      returning: true,
      individualHooks: true,
    });

    console.log('nbUpdated :', nbUpdated);
    console.log('users :', users);

    if (nbUpdated === 0) {
      console.log('PostreSQL - Aucune modification apportée');
      return res.status(404).json({ error: 'Aucune modification apportée' });
    }

    console.log('Mis à jour (Postgres) réussie');
    return res.status(200).json({ message: 'Mise à jour réussie' });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      throw ValidationError.fromSequelizeValidationError(e);
    }
    console.error('Erreur lors de la mise à jour du token :', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du token' });
  }
}

module.exports = { updateToken };