const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


async function signup(req, res) {
    try {
        if (!req.body?.email || !req.body?.password || !req.body?.website) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            website: req.body.website,
            is_verified: false,
            trackers: {},
        });

        await user.save();
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
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json({ error: 'Missing parameters' });
        }
        const user = await User.findOne({ email: req.body.email });

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

        const token = jwt.sign(
            { userId: user._id },
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
            userId: user._id,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUser(req, res) {

    User.find()
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({ error }));
};


module.exports = { signup, login, getUser };