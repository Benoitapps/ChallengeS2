const connection = require("./db");
const fs = require("fs");
const path = require("path");

const db = {connection};
 
// Cela récupère la liste des fichiers présents dans le répertoire models en utilisant 
// fs.readdirSync. __dirname est une variable qui représente le chemin absolu du répertoire du fichier en cours.
const files = fs.readdirSync(path.join(__dirname, "models")); 

files.forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);

  db[model.name] = model;

});

const User = db.User;
const KpiName = db.KpiName;
const Tag = db.Tag;
const Tunnel = db.Tunnel;
const TunnelTag = db.TunnelTag;

User.belongsToMany(KpiName, { through: "UserKpiNames" });
KpiName.belongsToMany(User, { through: "UserKpiNames" });

Tag.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Tag, {
  foreignKey: "userId",
});

Tag.hasMany(TunnelTag, {
  foreignKey: "tagId",
  alias: "tunnel_tags",
});
TunnelTag.belongsTo(Tag, {
  foreignKey: "tagId",
  through: "TunnelTag",
  alias: "tag",
});

TunnelTag.belongsTo(Tunnel, {
  foreignKey: "tunnelId",
  through: "TunnelTag",
  alias: "tunnel",
});
Tunnel.hasMany(TunnelTag, {
  foreignKey: "tunnelId",
  alias: "tunnel_tags",
});

module.exports = db;
