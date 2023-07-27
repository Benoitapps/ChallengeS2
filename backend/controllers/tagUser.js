//const User2 = require('../models/User');
//const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const Usertracker = require('../models/Usertracker');
require('dotenv').config({ path: '.env.local', override: true });

function getConnectedUserId(req) {
      const token = req.cookies.token;
  
      if (!token) {
        new Error('Token not found');
      }
  
      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userToken = decoded.userToken;
  
        return userToken;
      } catch (error) {
       new Error('Invalid token');
      }
    
  }

  function formatDuration(duration) {
    function convertDuration(ms) {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
      return {
        hours: hours === 0 ? null : hours,
        minutes: minutes === 0 && hours === 0 ? null : minutes,
        seconds: seconds
      };
    }
  
    const convertedDuration = convertDuration(duration);
    let formattedDuration = "";
  
    if (convertedDuration.hours !== null) {
      formattedDuration += `${convertedDuration.hours}h `;
    }
  
    if (convertedDuration.minutes !== null) {
      formattedDuration += `${convertedDuration.minutes}min `;
    }
  
    formattedDuration += `${convertedDuration.seconds}s`;
  
    return formattedDuration;
  }
 

  async function getTag(req, res) {
    try {
      console.log("GetAPI");
      const {apiToken} = req.body
      console.log("body",apiToken)
     // const api_tokenUsder =getConnectedUserId(req);
      const api_tokenUsder =apiToken;
      console.log("api_tokenUsder", api_tokenUsder);
      const periods = req.param.resperiod;
      const title = req.param.nameCard;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////clics par tag ///////////////////////////////////////
const pipeline5 = [
  {
    $match: {
      api_token: apiToken,
    },
  },
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
                  input: "$$visitor.sessions",
                  as: "tracker",
                  in: {
                    $size: {
                      $filter: {
                        input: "$$tracker.tags",
                        as: "tag",
                        cond: {
                          $eq: [
                            "$$tag.eventType",
                            "click",
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      clickTokens: {
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
                  in: {
                    $concatArrays: [
                      "$$value",
                      {
                        $map: {
                          input: {
                            $filter: {
                              input:
                                "$$this.tags",
                              as: "tag",
                              cond: {
                                $eq: [
                                  "$$tag.eventType",
                                  "click",
                                ],
                              },
                            },
                          },
                          as: "filteredTag",
                          in: "$$filteredTag.token",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $unwind: "$clickTokens",
  },
  {
    $group: {
      _id: "$clickTokens",
      count: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: null,
      results: {
        $push: {
          path: "$_id",
          count: "$count",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      result: {
        $arrayToObject: [
          [{ k: "results", v: "$results" }],
        ],
      },
    },
  },
]

const result5 = await Usertracker.aggregate(pipeline5).exec();
      const resPages = result5[0]

        console.log("resPages "+ resPages);
        console.log(resPages);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const pipeline4 = [
          {
            $match: {
              api_token: apiToken,
            },
          },
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
                          input: "$$visitor.sessions",
                          as: "tracker",
                          in: {
                            $size: {
                              $filter: {
                                input: "$$tracker.tags",
                                as: "tag",
                                cond: {
                                  $eq: [
                                    "$$tag.eventType",
                                    "mouseover",
                                  ],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              clickTokens: {
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
                          in: {
                            $concatArrays: [
                              "$$value",
                              {
                                $map: {
                                  input: {
                                    $filter: {
                                      input:
                                        "$$this.tags",
                                      as: "tag",
                                      cond: {
                                        $eq: [
                                          "$$tag.eventType",
                                          "mouseover",
                                        ],
                                      },
                                    },
                                  },
                                  as: "filteredTag",
                                  in: "$$filteredTag.token",
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $unwind: "$clickTokens",
          },
          {
            $group: {
              _id: "$clickTokens",
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              results: {
                $push: {
                  path: "$_id",
                  count: "$count",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              result: {
                $arrayToObject: [
                  [{ k: "results", v: "$results" }],
                ],
              },
            },
          },
        ]
        
        const result4 = await Usertracker.aggregate(pipeline4).exec();
              const resPagesover = result4[0]
        
                console.log("resPages "+ resPagesover);
                console.log(resPagesover);

    res.status(200).json({ 
        resPage : resPages,
        resPageover : resPagesover
     }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  async function tagChoice(req, res) {
    try {
      const {apiToken} = req.body
      console.log("body",apiToken)
     // const api_tokenUsder =getConnectedUserId(req);
     const api_tokenUsder =apiToken;
      const periods = req.params.resperiod;
      const title = req.params.nameCard;
      console.log("tagChoice : "+ periods + ","+ title);

      let dateformattoday = new Date()

      if(!req.params?.nameCard || !req.params?.resperiod) {
        return res.status(400).json({ error: 'Missing parameters' });
    } else {
        if(req.params?.resperiod === '24h') {
            unit = 'hour';
            amount = 24;
            dateformattoday.setHours(dateformattoday.getHours() + 24);
            
        } else if(req.params?.resperiod === '7d') {
            unit = 'day';
            amount = 7;
            dateformattoday.setDate(dateformattoday.getDate() + 7);
        } else if(req.params?.resperiod === '30d') {
            unit = 'day';
            amount = 30;
            dateformattoday.setDate(dateformattoday.getDate() + 30);
        } else if(req.params?.resperiod === '12m') {
            unit = 'month';
            amount = 12;
            dateformattoday.setMonth(dateformattoday.getMonth() + 12);
        }else{
          unit = 'year';
          amount = 10;
        }
      }

     
    //////page///////////////////////////////////////////////////////////////////////////////////////////
   if(req.params?.nameCard === 'page') {
    const pipeline =  [
      { $match: { "api_token": api_tokenUsder } },
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
                      input: "$$visitor.sessions",
                      as: "tracker",
                      in: { $size: "$$tracker.clicks" }
                    }
                  }
                }
              }
            }
          },
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
                      in: { $concatArrays: ["$$value", "$$this.clicks.path"] }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $unwind: "$clickPaths"
      },
      {
        $group: {
          _id: "$clickPaths",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null, // Utiliser null pour regrouper tous les résultats en un seul groupe
          results: {
            $push: {
              path: "$_id",
              count: "$count"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          result: { $arrayToObject: [[{ k: "results", v: "$results" }]] } // Convertir le tableau de résultats en un objet avec la clé "results"
        }
      }
    ]
    

    const result = await Usertracker.aggregate(pipeline).exec();
    let resVisiteur = 0;
   if(result.length == 0){
    resVisiteur = 0;
   }else{
    resVisiteur = result[0].totalSessions;
    }
    console.log("resVisiteur " +resVisiteur );
    

  res.status(200).json({ 
      res: resVisiteur.toString()
   });



    
    }else{
      getTag(req, res);
    }






  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
  }



  module.exports = { getTag,tagChoice };