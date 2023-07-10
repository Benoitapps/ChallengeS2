const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clickSchema = new Schema({
    visitor_token: { type: String, required: true },
    count: { type: Number, required: true }
});

const tagSchema = new Schema({
    name: { type: String, required: true },
    tag_id: { type: String, required: true },
    clicks: [clickSchema]
});

module.exports = mongoose.model('Tag', tagSchema);

