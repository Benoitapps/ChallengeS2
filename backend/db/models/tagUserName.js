module.exports = function (connection) {
const { DataTypes, Model } = require("sequelize");

class TagName extends Model {}
TagName.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "tagnames",
    sequelize: connection,
    timestamps: false,
  }
);

return TagName;
}



