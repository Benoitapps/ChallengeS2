const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const usersessions = require('../models/Usertracker');

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


async function getCharts(req, res) {
    let unit = '';
    let amount = 0;

    if(!req.params?.nameCard || !req.params?.resperiod) {
        return res.status(400).json({ error: 'Missing parameters' });
    } else {
        if(req.params?.resperiod === '24h') {
            unit = 'hour';
            amount = 24;
        } else if(req.params?.resperiod === '7d') {
            unit = 'day';
            amount = 7;
        } else if(req.params?.resperiod === '30d') {
            unit = 'day';
            amount = 30;
        } else if(req.params?.resperiod === '12m') {
            unit = 'month';
            amount = 12;
        }

        if(req.params?.nameCard === 'clics') {
            usersessions.aggregate(
                [
                    {
                        $match: {
                            api_token:
                                "ikb3yt96da5pz1d47x5wv1dn12v3voly",
                        },
                    },
                    {
                        $unwind: "$visitors",
                    },
                    {
                        $unwind: "$visitors.sessions",
                    },
                    {
                        $match: {
                            $expr: {
                                $gte: [
                                    "$visitors.sessions.endTime",
                                    {
                                        $dateSubtract: {
                                            startDate: "$$NOW",
                                            unit: unit,
                                            amount: amount,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            amount: {
                                $size: "$visitors.sessions.clicks",
                            },
                            date: "$visitors.sessions.endTime",
                        },
                    },
                    {
                        $sort: {
                            date: 1,
                        }
                    }
                ]
            )
                .then(clicks => res.json(clicks))
                .catch(err => res.status(400).json('Error: ' + err));
        }

        if(req.params?.nameCard === 'sessions') {
            usersessions.aggregate(
                [
                    {
                        $match: {
                            api_token:
                                "ikb3yt96da5pz1d47x5wv1dn12v3voly",
                        },
                    },
                    {
                        $unwind: "$visitors",
                    },
                    {
                        $unwind: "$visitors.sessions",
                    },
                    {
                        $match: {
                            $expr: {
                                $gte: [
                                    "$visitors.sessions.endTime",
                                    {
                                        $dateSubtract: {
                                            startDate: "$$NOW",
                                            unit: unit,
                                            amount: amount,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            amount: {
                                $sum: 1
                            },
                            date: "$visitors.sessions.endTime",
                        },
                    },
                    {
                        $sort: {
                            date: 1,
                        }
                    }
                ]
            )
                .then(sessions => res.json(sessions))
                .catch(err => res.status(400).json('Error: ' + err));
        }
    }
}

module.exports = {
    getCharts
};