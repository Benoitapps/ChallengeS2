const express = require('express');
const router = express.Router();
const usertrackers = require('../models/Usertracker');

router.post('/', (req, res) => {
    let unit = '';
    let amount = 0;

    if(!req.body?.title || !req.body?.periods) {
        return res.status(400).json({ error: 'Missing parameters' });
    } else {
        if(req.body?.periods === '24h') {
            unit = 'hour';
            amount = 24;
        } else if(req.body?.periods === '7d') {
            unit = 'day';
            amount = 7;
        } else if(req.body?.periods === '30d') {
            unit = 'day';
            amount = 30;
        } else if(req.body?.periods === '12m') {
            unit = 'month';
            amount = 12;
        }

        if(req.body?.title === 'clics') {
            usertrackers.aggregate(
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
                        $unwind: "$visitors.trackers",
                    },
                    {
                        $match: {
                            $expr: {
                                $gte: [
                                    "$visitors.trackers.endTime",
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
                                $size: "$visitors.trackers.clicks",
                            },
                            date: "$visitors.trackers.endTime",
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

        if(req.body?.title === 'sessions') {
            usertrackers.aggregate(
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
                        $unwind: "$visitors.trackers",
                    },
                    {
                        $match: {
                            $expr: {
                                $gte: [
                                    "$visitors.trackers.endTime",
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
                            date: "$visitors.trackers.endTime",
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
});

module.exports = router;