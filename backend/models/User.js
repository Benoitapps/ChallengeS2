const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
  mouse: [],
  clicks: [],
  startTime: Date,
  endTime: Date
});

const visitorSchema = new Schema({
  user_token: String,
  dateFirstVisit: Date,
  dateLastVisit: Date,
  trackers: [trackerSchema]
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  api_token: { type: String, required: true },
  visitors: [visitorSchema],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);