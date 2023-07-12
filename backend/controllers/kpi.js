//const User2 = require('../models/User');
//const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const { getConnectedUser } = require("./user");
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
  
  // Utilisation de la fonction getConnectedUserId dans une autre partie de votre backend
  // ...
  
  // Exemple d'utilisation dans une autre fonction
  async function someOtherFunction(req, res) {
    try {
      //const userToken = await getConnectedUserId(req);
      //console.log("les token est " + userToken);
      const date = req.param.date;
      const name = req.param.
      console.log("date : "+ req.param.name);
      //session 
      const pipeline = [
        { $match: { "api_token": "ikb3yt96da5pz1d47x5wv1dn12v3voly" } },
        {
          $project: {
            totalTrackers: {
              $sum: {
                $map: {
                  input: "$visitors",
                  as: "visitor",
                  in: { $size: "$$visitor.trackers" }
                }
              }
            }
          }
        }
      ];
      
      const result = await Usertracker.aggregate(pipeline).exec();
      const totalSessions = result[0].totalTrackers;
      console.log("session " + totalSessions);
      ////////////////////////////////////////////////////////////
      const pipeline2 = [
        { $match: { "api_token": "ikb3yt96da5pz1d47x5wv1dn12v3voly" } },
        {
          $project: {
            totalClicks: {
              $sum: {
                $map: {
                  input: "$visitors",
                  as: "visitor",
                  in: {
                    $sum: {
                      $map: {
                        input: "$$visitor.trackers",
                        as: "tracker",
                        in: { $size: "$$tracker.clicks" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ];
      
      const result2 = await Usertracker.aggregate(pipeline2).exec();
      const totalClicks = result2[0].totalClicks

        console.log("clic "+ totalClicks);

    res.status(200).json({ 
        totalClicks: totalClicks, 
        totalSessions: totalSessions
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }
  
  
  module.exports = { someOtherFunction };