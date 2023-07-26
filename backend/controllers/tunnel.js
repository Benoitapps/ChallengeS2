const Tunnel = require("../db").Tunnel;
const TunnelTag = require("../db").TunnelTag;
const jwt = require('jsonwebtoken');

const generateToken = require('../utils/generateToken');

async function create(req, res) {
    let data = req.body;
    const token = req.cookies["token"];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
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
        console.log(err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

async function all(req, res) {
    const token = req.cookies["token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // ! RANDOM_TOKEN_SECRET dans env
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
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
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

module.exports = { create, all, deleteItem };