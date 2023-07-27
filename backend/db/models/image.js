module.exports = function (connection) {
    const { DataTypes, Model } = require("sequelize");
    
    class Image extends Model {}
    Image.init(
      {
        src: {
            type: DataTypes.TEXT, // Change the type to VARCHAR(1000)
            allowNull: false,
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        api_token: {
            type: DataTypes.STRING,
            allowNull: false,
          }
        
      },
      {
        tableName: "image",
        sequelize: connection,
        timestamps: false,
      }
    );
    
    return Image;
    }
    
    
    
    