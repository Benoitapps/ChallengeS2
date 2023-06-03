const express = require('express');

require('dotenv').config({ path: '.env.local', override: true });

const bdd = process.env.BDD;

const app = express();

const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose.connect(bdd,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());//permet du'utiliser req.body pour voir dans son json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//d'envoyer des requêtes avec les méthodes mentionnées 
    next();
  });

app.use('/api/auth', userRoutes);

  module.exports = app;