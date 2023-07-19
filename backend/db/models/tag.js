module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class Tag extends Model {}

    Tag.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "tag",
            sequelize: connection,
        },
    );

    return Tag;
}