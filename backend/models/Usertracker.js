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
  website: { type: String },
  is_verified: {type: Boolean },
  trackers: {
    mouse: [{
      x: Number,
      y: Number,
      timestamp: Number,
      path: String
    }],
    clicks: [{
      x: Number,
      y: Number,
      timestamp: Number,
      target: String,
      outerHTML: String,
      path: String
    }],
    startTime: Date,
    endTime: Date
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usertracker', userSchema);