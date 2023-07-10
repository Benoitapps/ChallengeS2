//const User2 = require('../models/User');
//const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const generateToken = require('../utils/generateToken');
const Usertracker = require('../models/Usertracker');

async function signup(req, res) {
    try {
       //const t = await connection.transaction();
        if (!req.body?.email || !req.body?.password || !req.body?.website) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const apiToken = generateToken(32);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user =  User.create({
            email: req.body.email,
            password: hashedPassword,
            website: req.body.website,
            api_token: apiToken,
        });
        
        // Save api token tag in mongodb
        const userTracker = new Usertracker({
            api_token: apiToken,
            visitors: [],
        });
        await userTracker.save();

        res.status(201).json({ 
            message: 'Utilisateur créé !',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function login(req, res) {
    try {
        //console.log("je passe ");
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json({ error: 'Missing parameters' });
        }
        const user = await User.findOne({ 
            where: {email: req.body.email },});

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //console.log(user.is_verified)
        if (user.is_verified === false) {
            return res.status(401).json({ error: 'Votre compte doit etre valider par un admin' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        console.log("lID "+ user.id);
        const token = jwt.sign(
            { userId: user.id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
        );
        //console.log(token);

        res.cookie('token', token, { 
            maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie en millisecondes (24 heures dans cet exemple)
            httpOnly: true, // Empêche l'accès au cookie depuis JavaScript côté client
            secure: false, // Le cookie sera envoyé uniquement via une connexion HTTPS si votre application est en production
            sameSite: false,
            signed : false
        });
        
        res.status(200).json({
            userId: user.id,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUser(req, res) {

    User.findAll()
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({ error }));
};

function getConnectedUser(req, res) {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Token not found' });
    }
  
    try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decoded.userId;
  
      // Rechercher l'utilisateur correspondant à l'ID
      User.findOne({ where: { id: userId } })
        .then(user => {
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
  
          // Renvoyer les informations de l'utilisateur connecté
          res.status(200).json({
            userId: user.id,
            email: user.email,
            website: user.website,
            // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
          });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }


  async function logout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  module.exports = { signup, login, getUser, getConnectedUser, logout };