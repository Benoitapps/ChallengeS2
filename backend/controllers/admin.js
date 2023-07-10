const User = require("../db").User;
const Usertracker = require('../models/Usertracker');
const generateToken = require('../utils/generateToken');

async function getUserNotVerified(req, res) {
  try {
    const users = await User.findAll({ where: { is_verified: false } });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function UserVerified(req, res) {
  try {
    const updatedUser = await User.update(
      { is_verified: true },
      { where: { id: req.params.id } }
    );
    // create api token tag in mongodb

    const userTracker = new Usertracker({
        api_token: generateToken(32),
        visitors: [],
    });
    await userTracker.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { getUserNotVerified, UserVerified };