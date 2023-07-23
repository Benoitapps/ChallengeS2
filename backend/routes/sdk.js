const express = require("express");
const router = express.Router();
const Usertracker = require("../models/Usertracker");
const User = require("../db").User;

router.post("/", async (req, res) => {
try {
    let data = JSON.parse(req.body);

    // find user by api_token
    const user = await User.findOne({ where: { api_token: data.api_token } });
    if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }

    // update or create user tracker
    let userTracker = await Usertracker.findOne({ api_token: data.api_token });

    if (!userTracker) {
        // create user tracker if it doesn't exist
        userTracker = new Usertracker({
            api_token: data.api_token,
            visitors: [],
        });
    }

    const user_fingerprint = data.user_fingerprint;
    const visitorIndex = userTracker.visitors.findIndex(
        (visitor) => visitor.user_fingerprint === user_fingerprint
    );

    if (visitorIndex === -1) {
        // create a new visitor if not found
        const newVisitor = {
            user_fingerprint: user_fingerprint,
            dateFirstVisit: new Date(),
            dateLastVisit: new Date(),
            sessions: [
                {
                    mouse: data.mouse,
                    clicks: data.clicks,
                    paths: data.paths,
                    startTime: data.startTime,
                    endTime: data.endTime,
                }
            ],
        };
        userTracker.visitors.push(newVisitor);
    } else {
        // update existing visitor
        const visitor = userTracker.visitors[visitorIndex];
        visitor.dateLastVisit = new Date();
        visitor.sessions.push({
            mouse: data.mouse,
            clicks: data.clicks,
            paths: data.paths,
            startTime: data.startTime,
            endTime: data.endTime,
        });
    }

    // save user tracker
    await userTracker.save();

    // respond with data
    res.status(200); // pas de json car on ne veut pas de réponse avec le sendBeacon
} catch (error) {
    console.error(error);
    res.status(500);
}
});

module.exports = router;
