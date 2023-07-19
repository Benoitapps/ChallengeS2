const connection = require("./db");
const fs = require("fs");
const path = require("path");

const db = {connection};


const files = fs.readdirSync(path.join(__dirname, "models")); //Cela récupère la liste des fichiers présents dans le répertoire models en utilisant fs.readdirSync. __dirname est une variable qui représente le chemin absolu du répertoire du fichier en cours.

files.forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);

  db[model.name] = model;

});

const User = db.User;
const KpiName = db.KpiName;

User.belongsToMany(KpiName, { through: "UserKpiNames" });
KpiName.belongsToMany(User, { through: "UserKpiNames" });

module.exports = db;
