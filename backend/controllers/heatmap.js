//const User2 = require('../models/User');
//const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware').default;
const services = '../services/user'
const User = require("../db").User;
const Image = require("../db").Image;

const Usertracker = require('../models/Usertracker');


function getConnectedUserId(req) {
  const token = req.cookies.token;

  if (!token) {
    new Error('Token not found');
  }

  try {
    const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userToken = decoded.userToken;

    return userToken;
  } catch (error) {
   new Error('Invalid token');
  }

}

  function getColor(value){
    if(value <= 2){
        return "Blue";
    }
    else if(value <= 10){
        return "Orange";
    }else{
        return "Red";
    }
  }

  async function getHeatmapClic(req, res) {
    try {
      const {apiToken} = req.body
      console.log("body",apiToken);
      //const api_tokenUsder =getConnectedUserId(req);
      const api_tokenUsder =apiToken;

      console.log("body2",api_tokenUsder);
      console.log("GetAPI");
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

      //session 
      const pipeline = [
        { $match: { "api_token": api_tokenUsder } },
        {
          $project: {
            clickPaths: {
              $reduce: {
                input: "$visitors",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $reduce: {
                        input: "$$this.sessions",
                        initialValue: [],
                        in: "$$this.clicks"
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $unwind: "$clickPaths" },
        {
          $group: {
            _id: "$clickPaths.path",
            coordinates: {
              $push: {
                x: "$clickPaths.x",
                y: "$clickPaths.y"
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            results: {
              $push: {
                path: "$_id",
                coordinates: "$coordinates"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            result: { $arrayToObject: [[{ k: "results", v: "$results" }]] }
          }
        }
      ]
      
const result = await Usertracker.aggregate(pipeline).exec();
      const resPages = result[0].result.results;
      let resValue;

      resPages.forEach(element => {
       //console.log(element.coordinates);
        element.coordinates.forEach(coord => {
            coord.value = 0;   
            element.coordinates.forEach(coord2 => {
               //console.log( coord2.x-10,"<=",coord.x,"<=",coord2.x+10);
                if( ((coord2.x-10 <= coord.x) && (coord.x <= coord2.x+10))&& (coord2.y-10 <= coord.y) && (coord.y <= coord2.y+10) ){
                    //console.log("res= ",((coord2.x-10 <= coord.x) && (coord.x <= coord2.x+10))&& (coord2.y-10 <= coord.y) && (coord.y <= coord2.y+10))
                    coord.x = coord.x*1136/1536;
                    coord.y = coord.y*570/864;

                    coord.value++
                }
            })          
        });
     });
    //  resPages.forEach(element => {
    //     element.coordinates.forEach(coord => {
    //         coord.color = getColor(coord.value);
    //         //console.log(coord.color);
    //  });
    // });

       // console.log("resPages "+ resPages);
        //console.log(resPages);

    res.status(200).json({ 
        resPage : resPages
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }

  async function getHeatmapMouse(req, res) {
    try {
      //console.log("GetAPI");
      const {apiToken} = req.body
      console.log("body",apiToken);
      //const api_tokenUsder =getConnectedUserId(req);
      const api_tokenUsder =apiToken;
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

      //session 
      const pipeline = [
        { $match: { "api_token": api_tokenUsder } },
        {
          $project: {
            clickPaths: {
              $reduce: {
                input: "$visitors",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $reduce: {
                        input: "$$this.sessions",
                        initialValue: [],
                        in: "$$this.mouse"
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $unwind: "$clickPaths" },
        {
          $group: {
            _id: "$clickPaths.path",
            coordinates: {
              $push: {
                x: "$clickPaths.x",
                y: "$clickPaths.y"
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            results: {
              $push: {
                path: "$_id",
                coordinates: "$coordinates"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            result: { $arrayToObject: [[{ k: "results", v: "$results" }]] }
          }
        }
      ]
      
const result = await Usertracker.aggregate(pipeline).exec();
      const resPages = result[0].result.results;
      let resValue;

      resPages.forEach(element => {
       //console.log(element.coordinates);
        element.coordinates.forEach(coord => {
            coord.value = 0;   
            element.coordinates.forEach(coord2 => {
               //console.log( coord2.x-10,"<=",coord.x,"<=",coord2.x+10);
                if( ((coord2.x-10 <= coord.x) && (coord.x <= coord2.x+10))&& (coord2.y-10 <= coord.y) && (coord.y <= coord2.y+10) ){
                    //console.log("res= ",((coord2.x-10 <= coord.x) && (coord.x <= coord2.x+10))&& (coord2.y-10 <= coord.y) && (coord.y <= coord2.y+10))
                    coord.value++;
                    coord.x = coord.x*1136/1536;
                    coord.y = coord.y*570/864;
                    
                }
            })          
        });
     });
    //  resPages.forEach(element => {
    //     element.coordinates.forEach(coord => {
    //         coord.color = getColor(coord.value);
    //         //console.log(coord.color);
    //  });
    // });

       // console.log("resPages "+ resPages);
        //console.log(resPages);

    res.status(200).json({ 
        resPageMouse : resPages
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }



  async function uploadImage(req, res) {
    console.log("leBodyest : ",req.body)
    try {
      const { image } = req.body;
      const { token } = req.body;
      const { name } = req.body;
 
      let imagecree ="";
      const testimage =await Image.findOne({
        where: { api_token: token , name : name},
      });
      console.log("la value de test image est :",testimage);

      if(!testimage){
        console.log("je cree");
         imagecree = Image.create({
          name : name,
          src : image,
          api_token: token
      });
      
      }else{
        console.log("je update");
         imagecree = Image.update(
          {src : image},
          { where: { api_token: token, name:name} }
        );
      }

      console.log("image remplacer");
      console.log("image ajouter");
      res.status(200).json({ 
        message: 'Image remplacer ou cree !',
        email: imagecree
          });
    } catch (error) {
      res.status(500).json({ error: "Image upload failed" });
    }
  }

  async function getImageSrc(req, res) {
    try {
      //const ttoken =req.param.api_token;
      const {apiToken} = req.body; // Assuming the API token is passed as a URL parameter
      console.log("imagetokenmtn",apiToken);
  
      const image = await Image.findAll({
        where: { api_token: apiToken },
      });
  
      if (!image) {
        return res.status(404).json({ error: "Image not found for this user" });
      }
  
      res.status(200).json({  image });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve image source" });
    }
  }

  async function getOneImageSrc(req, res) {
    try {
      //const ttoken =req.param.api_token;
      const {apiToken} = req.body; // Assuming the API token is passed as a URL parameter
      const {name} = req.body;
      console.log("imagetokenmtn",apiToken);
  
      const image = await Image.findOne({
        where: { api_token: apiToken, name: name },
      });
  
      if (!image) {
        return res.status(404).json({ error: "Image not found for this user" });
      }
  
      res.status(200).json(  image );
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve image source" });
    }
  }



  module.exports = { getHeatmapClic,getHeatmapMouse,uploadImage,getImageSrc,getOneImageSrc };