module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");

    class ChartsName extends Model {}
    ChartsName.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "chartsnames",
            sequelize: connection,
            timestamps: false,
        }
    );

    return ChartsName;
}



