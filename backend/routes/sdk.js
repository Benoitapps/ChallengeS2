const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    let data = JSON.parse(req.body);

    // find user by api_token
    const user = await User.findOne({ api_token: data.api_token });

    if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }

    // update user
    user.trackers.push(data.trackers);

    // save user
    user.save();

    // res user without password
    res.status(200).json({
        userId: user._id,
        email: user.email,
        trackers: user.trackers
    });
});

module.exports = router;