const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env.local', override: true });

const bdd = process.env.BDD;

const app = express();

// Use to allow cross-origin requests
app.use(cors());
// Use to parse JSON body
app.use(express.json());

mongoose.connect(bdd,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }).then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
              email: req.body.email,
              password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});