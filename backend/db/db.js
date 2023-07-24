const Sequelize = require("sequelize");

//const connection = new Sequelize(process.env.DATABASE_URL);
const connection = new Sequelize('app', 'root', 'password', {
  host: process.env.DOMAIN_NAME,
  dialect: 'postgres',
});

connection
  .authenticate()
  .then(() => {
    console.log("Connection a Postgres OK.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = connection;
