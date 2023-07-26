const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const usersessions = require('../models/Usertracker');

function getConnectedUserId(req) {
    const token = req.cookies.token;

    if (!token) {
        new Error('Token not found');
    }

    try {
        const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userToken = decoded.userToken;

        return userToken;
    } catch (error) {
        new Error('Invalid token');
    }
}

async function getCharts(req, res) {
    let unit = '';
    let amount = 0;
   // const api_tokenUsder = getConnectedUserId(req);
   const {apiToken} = req.body
      console.log("body",apiToken)
     // const api_tokenUsder =getConnectedUserId(req);
     const api_tokenUsder =apiToken;

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
                            api_tokenUsder,
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
                            api_token: api_tokenUsder,
                        },
                    },
                    {
                        $unwind: "$visitors",
                    },
                    {
                        $unwind: "$visitors.sessions",
                    },
                    {
                        $addFields: {
                            startInterval: {
                                $dateFromParts: {
                                    year: { $year: "$visitors.sessions.startTime" },
                                    month: { $month: "$visitors.sessions.startTime" },
                                    day: { $dayOfMonth: "$visitors.sessions.startTime" },
                                    hour: { $hour: "$visitors.sessions.startTime" },
                                    minute: {
                                        $subtract: [
                                            { $minute: "$visitors.sessions.startTime" },
                                            { $mod: [{ $minute: "$visitors.sessions.startTime" }, 1] },
                                        ],
                                    },
                                    second: 0,
                                    millisecond: 0,
                                },
                            },
                            endInterval: {
                                $dateFromParts: {
                                    year: { $year: "$visitors.sessions.endTime" },
                                    month: { $month: "$visitors.sessions.endTime" },
                                    day: { $dayOfMonth: "$visitors.sessions.endTime" },
                                    hour: { $hour: "$visitors.sessions.endTime" },
                                    minute: {
                                        $subtract: [
                                            { $minute: "$visitors.sessions.endTime" },
                                            { $mod: [{ $minute: "$visitors.sessions.endTime" }, 1] },
                                        ],
                                    },
                                    second: 0,
                                    millisecond: 0,
                                },
                            },
                        },
                    },
                    {
                        $match: {
                            $expr: {
                                $gte: ["$endInterval", { $dateSubtract: { startDate: "$$NOW", unit: unit, amount: amount } }],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                startInterval: "$startInterval",
                            },
                            amount: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id.startInterval",
                            amount: 1,
                        },
                    },
                    {
                        $sort: {
                            date: 1,
                        },
                    },
                ]
            )
                .then(
                    sessions => {
                        let dataSessions = sessions;

                        dataSessions.forEach((session, index) => {
                            const sessionDate = new Date(session.date);
                            const sessionDateEnd = new Date(sessionDate); // Create a new Date object

                            // Add 1 minute to the sessionDateEnd
                            sessionDateEnd.setMinutes(sessionDateEnd.getMinutes() + 1);

                            if (dataSessions[index + 1] && dataSessions[index + 1].date.getTime() !== sessionDateEnd.getTime()) {
                                dataSessions.splice(index + 1, 0, {
                                    date: sessionDateEnd,
                                    amount: 0
                                });
                            }
                        });

                        res.json(dataSessions);
                    }
                )
                .catch(err => res.status(400).json('Error: ' + err));
        }
    }
}

module.exports = {
    getCharts
};