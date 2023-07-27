const express = require("express");
const router = express.Router();
const Usertracker = require("../models/Usertracker");
const User = require("../db").User;
const Tag = require("../db").Tag;

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

        // prendre que les tags qui correspondent à l'utilisateur de la base de données
        const tags = await Tag.findAll({ where: { userId: user.id } });
        const tagsToken = tags.map((tag) => tag.token);

        // filtrer les tags qui ne sont pas dans la liste des tags de l'utilisateur
        data.tags = data.tags.filter((tag) => tagsToken.includes(tag.token));

        let session = {
            mouse: data.mouse,
            clicks: data.clicks,
            paths: data.paths,
            tags: data.tags,
            startTime: data.startTime,
            endTime: data.endTime,
        };

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
                sessions: [session],
            };
            userTracker.visitors.push(newVisitor);
        } else {
            // update existing visitor
            const visitor = userTracker.visitors[visitorIndex];
            visitor.dateLastVisit = new Date();
            visitor.sessions.push(session);
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
