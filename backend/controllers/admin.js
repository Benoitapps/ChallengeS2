const User = require('../models/Usertracker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



async function getUserNotVerified(req, res) {
        try {
          const users = await User.find({ is_verified: false });
          res.status(200).json(users);
        } catch (error) {
          res.status(400).json({ error });
        }
      }
      

async function UserVerified(req, res) {
        try {
          const updatedUser = await User.updateOne(
            { _id: req.params.id },
            { is_verified: true }
          );
          res.status(200).json(updatedUser);
        } catch (error) {
          res.status(400).json({ error });
        }
      }


module.exports = { getUserNotVerified, UserVerified };