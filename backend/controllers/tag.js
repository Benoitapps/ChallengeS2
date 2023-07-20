const Tag = require('../db/models/tag');

function add(req, res) {
    console.log("req.body : ", req.body);
    const tag = Tag.create({
        name: req.body.name,
        user_id: req.body.user_id,
    })
    res.status(201).json({ 
        message: 'Tag créé !',
        name: tag.name,
        user_id: tag.user_id,
    });
}

module.exports = { add };