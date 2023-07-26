module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class TunnelTag extends Model {}

    TunnelTag.init(
        {
            tunnelId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: "tunnel_tag",
            sequelize: connection,
        },
    );

    return TunnelTag;
}