//const User2 = require('../models/User');
//const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const Usertracker = require('../models/Usertracker');

function getConnectedUserId(req) {
    return new Promise((resolve, reject) => {
      const token = req.cookies.token;
  
      if (!token) {
        reject(new Error('Token not found'));
      }
  
      try {
        const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userToken = decoded.userToken;
  
        resolve(userToken);
      } catch (error) {
        reject(new Error('Invalid token'));
      }
    });
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
      console.log("GetAPI");
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

      //session 
      const pipeline = [
        { $match: { "api_token": "ikb3yt96da5pz1d47x5wv1dn12v3voly" } },
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
      console.log("GetAPI");
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

      //session 
      const pipeline = [
        { $match: { "api_token": "ikb3yt96da5pz1d47x5wv1dn12v3voly" } },
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
        console.log(resPages);

    res.status(200).json({ 
        resPageMouse : resPages
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }


  module.exports = { getHeatmapClic,getHeatmapMouse };