const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

async function signup(req, res) {
    try {
        if (!req.body?.email || !req.body?.password || !req.body?.website) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            api_token: generateToken(32),
            visitors: [],
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
        console.log(user.is_verified)
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