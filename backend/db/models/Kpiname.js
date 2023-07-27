module.exports = function (connection) {
const { DataTypes, Model } = require("sequelize");

class KpiName extends Model {}
KpiName.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "kpinames",
    sequelize: connection,
    timestamps: false,
  }
);

return KpiName;
}



