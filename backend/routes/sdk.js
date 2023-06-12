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
    const user_token = data.user_token;
    const visitor = user.visitors.find((visitor) => visitor.user_token === user_token);

    if (!visitor) {
        user.visitors.push({
            user_token: user_token,
            dateFirstVisit: new Date(),
            dateLastVisit: new Date(),
            trackers: [data.trackers]
        });
    } else {
        visitor.dateLastVisit = new Date();
        visitor.trackers.push(data.trackers);
    }

    // save user
    await user.save();

    // res user without password
    res.status(200).json({
        trackers: data.trackers
    });
});

module.exports = router;