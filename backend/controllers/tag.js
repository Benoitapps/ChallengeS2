const Tag = require("../db").Tag;
const jwt = require('jsonwebtoken');

const generateToken = require('../utils/generateToken');

function create(req, res) {
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; 
    Tag.create({
        name: req.body.label,
        token: generateToken(8),
        userId: userId,
    })

    res.status(201).json({
        name: req.body.label,
        token: generateToken(8),
        userId: userId,
    });
}

function all(req, res) {
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // ! RANDOM_TOKEN_SECRET dans env
    const userId = decodedToken.userId; 

    Tag.findAll({
        where: {
            userId: userId
        }
    }).then((tags) => {
        tags = tags.map((tag) => {
            tag = tag.dataValues;
            delete tag.userId;
            return tag;
        });
        res.status(200).json(tags);
    }).catch((err) => {
        res.status(500).json({
            err
        });
    });
}

function deleteItem(req, res) {
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; 
    const tagId = req.params.id;
    console.log("test----------------------", tagId, userId)

    Tag.destroy({
        where: {
            id: tagId,
            userId: userId
        }
    }).then(() => {
        res.status(200).json({
            message: "Tag supprimé avec succès"
        });
    }).catch((err) => {
        res.status(500).json({
            err
        });
    });
}

module.exports = { create, all, deleteItem };