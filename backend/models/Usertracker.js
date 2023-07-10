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
  user_fingerprint: String,
  dateFirstVisit: Date,
  dateLastVisit: Date,
  trackers: [trackerSchema]
});

const userTrackerSchema = new Schema({
  api_token: { type: String, required: true },
  visitors: [visitorSchema],
});

userTrackerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usertracker', userTrackerSchema);