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
 

  async function getKPI(req, res) {
    try {
      console.log("GetAPI");
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

      //session 
      const pipeline = [
        {
          $match: {
            api_token: "ikb3yt96da5pz1d47x5wv1dn12v3voly"
          }
        },
        {
          $unwind: "$visitors"
        },
        {
          $unwind: "$visitors.trackers"
        },
        {
          $match: {
            $expr: {
              $gte: [
                "$visitors.trackers.endTime",
                {
                  $dateSubtract: {
                    startDate: new Date(),
                    unit: "month",
                    amount: 5
                  }
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 }
          }
        }
      ]
      
      
      const result = await Usertracker.aggregate(pipeline).exec();
      const totalSessions = result[0].totalSessions;
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
        totalClicks: totalClicks.toString(), 
        totalSessions: totalSessions.toString()
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  async function kpiChoice(req, res) {
    try {

      const periods = req.params.resperiod;
      const title = req.params.nameCard;
      console.log("KpiChoice : "+ periods + ","+ title);


      if(!req.params?.nameCard || !req.params?.resperiod) {
        return res.status(400).json({ error: 'Missing parameters' });
    } else {
        if(req.params?.resperiod === '24h') {
            unit = 'hour';
            amount = 24;
        } else if(req.params?.resperiod === '7d') {
            unit = 'day';
            amount = 3;
        } else if(req.params?.resperiod === '30d') {
            unit = 'day';
            amount = 30;
        } else if(req.params?.resperiod === '12m') {
            unit = 'month';
            amount = 12;
        }else{
          unit = 'year';
          amount = 10;
        }
      }

      //session 
      if(req.params?.nameCard === 'Sessions') {
      const pipeline = [
        {
          $match: {
            api_token: "ikb3yt96da5pz1d47x5wv1dn12v3voly"
          }
        },
        {
          $unwind: "$visitors"
        },
        {
          $unwind: "$visitors.trackers"
        },
        {
          $match: {
            $expr: {
              $gte: [
                "$visitors.trackers.endTime",
                {
                  $dateSubtract: {
                    startDate: new Date(),
                    unit: unit,
                    amount: amount
                  }
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 }
          }
        }
      ]
      

      const result = await Usertracker.aggregate(pipeline).exec();
      let resSessions = 0;
     if(result.length == 0){
      resSessions = 0;
     }else{
      resSessions = result[0].totalSessions;
      }
      console.log("session " + resSessions);
      
    res.status(200).json({ 
        res: resSessions.toString()
     }); // Renvoie le nombre total de clics au format JSON
    
    }else if(req.params?.nameCard === 'Clics') {
      const pipeline = [
        [
          {
            $match: {
              api_token: "ikb3yt96da5pz1d47x5wv1dn12v3voly"
            }
          },
          {
            $unwind: "$visitors"
          },
          {
            $unwind: "$visitors.trackers"
          },
          {
            $match: {
              $expr: {
                $gte: [
                  "$visitors.trackers.endTime",
                  {
                    $dateSubtract: {
                      startDate: new Date(),
                      unit: unit,
                      amount: amount
                    }
                  }
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalClicks: { $sum: { $size: "$visitors.trackers.clicks" } }
            }
          }
        ]
      ]

      const result = await Usertracker.aggregate(pipeline).exec();
      let resClicks = 0;
     if(result.length == 0){
        resClicks = 0;
     }else{
        resClicks = result[0].totalClicks;
      }
      console.log("totalclick " +resClicks );
    
    res.status(200).json({ 
        res: resClicks.toString()
     });
    
    }else{
      getKPI(req, res);
    }






  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }



  module.exports = { getKPI,kpiChoice };