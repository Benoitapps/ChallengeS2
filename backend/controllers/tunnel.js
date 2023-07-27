const Tunnel = require("../db").Tunnel;
const TunnelTag = require("../db").TunnelTag;
const jwt = require('jsonwebtoken');
const Usertracker = require('../models/Usertracker');
require('dotenv').config({ path: '.env.local', override: true });

async function create(req, res) {
    let data = req.body;
    const token = req.cookies["token"];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId; 

        // Create tunnel in DB
        let tunnel = await Tunnel.create({
            name: data.tunnel,
            userId: userId,
        })

        data.tags.forEach((tag) => {
            // Create tunnel_tag in DB
            TunnelTag.create({
                tunnelId: tunnel.dataValues.id,
                tagId: tag.id,
                position: tag.position,
            })
        })

        res.status(201).json(tunnel);
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
}

async function all(req, res) {
    const token = req.cookies["token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId; 
    
        let tunnels = [];
        tunnels = await Tunnel.findAll({
            where: {
                userId: userId
            },
        });
    
        res.status(200).json(tunnels)
    } catch {
        res.status(401).json({ error: "Unauthorized" });
    }
}

async function deleteItem(req, res) {
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId; 
    const tunnelId = req.params.id;
    try {
        await TunnelTag.destroy({
            where: {
                tunnelId: tunnelId
            }
        })

        await Tunnel.destroy({
            where: {
                id: parseInt(tunnelId),
                userId: userId
            }
        })

        res.status(200).json({ message: "Tunnel deleted" })
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
}

async function getStats(req, res) {
    // TODO: not working
    let data = req.body;
    data = JSON.parse(data);

    let userApi = data.userApi;

    const pipeline = [
        {
            $match: {
                api_token: userApi
            }
        },
        {
            $unwind: "$visitors"
        },
        {
            $unwind: "$visitors.sessions"
        },
        {
            $unwind: "$visitors.sessions.tags"
        },
        {
            $group: {
                _id: {
                    sessionId: "$visitors.sessions._id",
                    tagToken: "$visitors.sessions.tags.token"
                },
                tags: {
                    $push: "$visitors.sessions.tags"
                }
            }
        },
        {
            $group: {
                _id: "$_id.sessionId",
                sessionTags: {
                    $push: {
                        token: "$_id.tagToken",
                        tags: "$tags"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                sessionId: "$_id",
                sessionTags: 1
            }
        }
    ]

    const result = await Usertracker.aggregate(pipeline).exec();

    res.status(200).json(result);
}

async function updateName(req, res) {
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId; 
    let data = JSON.parse(req.body);
    const tunnelId = req.params.id;
    const newName = data.name;

    try {
        await Tunnel.update(
            {
                name: newName
            }, 
            {
                where: {
                    id: parseInt(tunnelId),
                    userId: userId
                }
            }   
        )

        res.status(200).json({ message: "Tunnel name updated" })
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = { create, all, deleteItem, getStats, updateName };