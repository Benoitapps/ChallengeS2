const Usertracker = require("../models/Usertracker");
const { User } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
require("dotenv").config({ path: ".env.local", override: true });

async function updateToken(req, res) {
  try {
    const { id } = req.params;
    const { oldToken, newToken } = req.body;

    const result = await Usertracker.updateMany(
      { api_token: oldToken },
      { $set: { api_token: newToken } }
    );

    const [nbUpdated, users] = await User.update(
      { api_token: newToken },
      {
        where: { id: id },
        returning: true,
        individualHooks: true,
      }
    );

    if (nbUpdated === 0) {
      return res.status(404).json({ error: "Aucune modification apportée" });
    }

    return res.status(200).json({ message: "Mise à jour réussie" });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      throw ValidationError.fromSequelizeValidationError(e);
    }
    console.error("Erreur lors de la mise à jour du token :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du token" });
  }
}

module.exports = { updateToken };
