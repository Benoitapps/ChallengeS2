module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Tunnel extends Model {}

    Tunnel.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "tunnel",
            sequelize: connection,
        },
    );

    return Tunnel;
}