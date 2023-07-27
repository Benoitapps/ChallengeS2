const Usertracker = require("../models/Usertracker");
require("dotenv").config({ path: ".env.local", override: true });

function formatDuration(duration) {
  function convertDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return {
      hours: hours === 0 ? null : hours,
      minutes: minutes === 0 && hours === 0 ? null : minutes,
      seconds: seconds,
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

async function getKPI(req, res) {
  try {
    const { apiToken } = req.body;
    const api_tokenUsder = apiToken;

    //session
    const pipeline = [
      {
        $match: {
          api_token: api_tokenUsder,
        },
      },
      {
        $unwind: "$visitors",
      },
      {
        $unwind: "$visitors.sessions",
      },
      {
        $match: {
          $expr: {
            $gte: [
              "$visitors.sessions.endTime",
              {
                $dateSubtract: {
                  startDate: new Date(),
                  unit: "month",
                  amount: 5,
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
        },
      },
    ];

    const result = await Usertracker.aggregate(pipeline).exec();
    const totalSessions = result[0].totalSessions;
    ////////////////////clics////////////////////////////////////////
    const pipeline2 = [
      { $match: { api_token: api_tokenUsder } },
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
                      in: { $size: "$$tracker.clicks" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];

    const result2 = await Usertracker.aggregate(pipeline2).exec();
    const totalClicks = result2[0].totalClicks;

    /////////////////////////////////////mtemps des session////////////////////////////////////////
    const pipeline3 = [
      {
        $match: {
          api_token: api_tokenUsder,
        },
      },
      {
        $unwind: "$visitors",
      },
      {
        $unwind: "$visitors.sessions",
      },
      {
        $addFields: {
          duration: {
            $subtract: [
              "$visitors.sessions.endTime",
              "$visitors.sessions.startTime",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: "$duration" },
        },
      },
      {
        $project: {
          _id: 0,
          averageDuration: 1,
        },
      },
    ];

    const result3 = await Usertracker.aggregate(pipeline3).exec();
    const resMoyenne = result3[0].averageDuration;

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////nombre de visiteur//////////////////////////////////////////
    const pipeline4 = [
      { $match: { api_token: api_tokenUsder } },
      {
        $project: {
          numberOfVisitors: {
            $size: "$visitors",
          },
        },
      },
    ];

    const result4 = await Usertracker.aggregate(pipeline4).exec();
    const resVisiteur = result4[0].numberOfVisitors;

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////clics par page ///////////////////////////////////////
    const pipeline5 = [
      { $match: { api_token: api_tokenUsder } },
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
                      in: { $size: "$$tracker.clicks" },
                    },
                  },
                },
              },
            },
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
                      in: { $concatArrays: ["$$value", "$$this.clicks.path"] },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: "$clickPaths",
      },
      {
        $group: {
          _id: "$clickPaths",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null, // Utiliser null pour regrouper tous les résultats en un seul groupe
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
          result: { $arrayToObject: [[{ k: "results", v: "$results" }]] }, // Convertir le tableau de résultats en un objet avec la clé "results"
        },
      },
    ];

    const result5 = await Usertracker.aggregate(pipeline5).exec();
    const resPages = result5[0];

    ////////////////////////////////////////////////////////////////////////////////
    const pipeline6 = [];

    const result6 = await Usertracker.aggregate(pipeline5).exec();
    const resPagesVisite = result5[0];

    ////////////////////////////////////////////////////////////////////////////////
    let timeStamp = 1688999649562;
    var dateformat = new Date(timeStamp);
    var dateformattoday = new Date();

    res.status(200).json({
      totalClicks: totalClicks.toString(),
      totalSessions: totalSessions.toString(),
      resMoyenne: formatDuration(resMoyenne),
      resVisiteur: resVisiteur.toString(),
      resPage: resPages,
    }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function kpiChoice(req, res) {
  try {
    const { apiToken } = req.body;
    const api_tokenUsder = apiToken;
    const periods = req.params.resperiod;
    const title = req.params.nameCard;

    let dateformattoday = new Date();

    if (!req.params?.nameCard || !req.params?.resperiod) {
      return res.status(400).json({ error: "Missing parameters" });
    } else {
      if (req.params?.resperiod === "24h") {
        unit = "hour";
        amount = 24;
        dateformattoday.setHours(dateformattoday.getHours() + 24);
      } else if (req.params?.resperiod === "7d") {
        unit = "day";
        amount = 7;
        dateformattoday.setDate(dateformattoday.getDate() + 7);
      } else if (req.params?.resperiod === "30d") {
        unit = "day";
        amount = 30;
        dateformattoday.setDate(dateformattoday.getDate() + 30);
      } else if (req.params?.resperiod === "12m") {
        unit = "month";
        amount = 12;
        dateformattoday.setMonth(dateformattoday.getMonth() + 12);
      } else {
        unit = "year";
        amount = 10;
      }
    }

    //session ////////////////////////////////////////////////////////////////////////////////////////////////
    if (req.params?.nameCard === "Sessions") {
      const pipeline = [
        {
          $match: {
            api_token: api_tokenUsder,
          },
        },
        {
          $unwind: "$visitors",
        },
        {
          $unwind: "$visitors.sessions",
        },
        {
          $match: {
            $expr: {
              $gte: [
                "$visitors.sessions.endTime",
                {
                  $dateSubtract: {
                    startDate: new Date(),
                    unit: unit,
                    amount: amount,
                  },
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
          },
        },
      ];

      const result = await Usertracker.aggregate(pipeline).exec();
      let resSessions = 0;
      if (result.length == 0) {
        resSessions = 0;
      } else {
        resSessions = result[0].totalSessions;
      }

      res.status(200).json({
        res: resSessions.toString(),
      });

      //Clics///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (req.params?.nameCard === "Clics") {
      const pipeline = [
        [
          {
            $match: {
              api_token: api_tokenUsder,
            },
          },
          {
            $unwind: "$visitors",
          },
          {
            $unwind: "$visitors.sessions",
          },
          {
            $match: {
              $expr: {
                $gte: [
                  "$visitors.sessions.endTime",
                  {
                    $dateSubtract: {
                      startDate: new Date(),
                      unit: unit,
                      amount: amount,
                    },
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalClicks: { $sum: { $size: "$visitors.sessions.clicks" } },
            },
          },
        ],
      ];

      const result = await Usertracker.aggregate(pipeline).exec();
      let resClicks = 0;
      if (result.length == 0) {
        resClicks = 0;
      } else {
        resClicks = result[0].totalClicks;
      }

      res.status(200).json({
        res: resClicks.toString(),
      });

      ////Moyenne des sessions/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (req.params?.nameCard === "Moyennedessessions") {
      const pipeline = [
        {
          $match: {
            api_token: api_tokenUsder,
          },
        },
        {
          $unwind: "$visitors",
        },
        {
          $unwind: "$visitors.sessions",
        },
        {
          $match: {
            $expr: {
              $gte: [
                "$visitors.sessions.endTime",
                {
                  $dateSubtract: {
                    startDate: new Date(),
                    unit: unit,
                    amount: amount,
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            duration: {
              $subtract: [
                "$visitors.sessions.endTime",
                "$visitors.sessions.startTime",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            averageDuration: { $avg: "$duration" },
          },
        },
      ];

      const result = await Usertracker.aggregate(pipeline).exec();
      let resMoyenne = 0;
      if (result.length == 0) {
        resMoyenne = 0;
      } else {
        resMoyenne = result[0].averageDuration;
      }

      resMoyenne = formatDuration(resMoyenne);

      res.status(200).json({
        res: resMoyenne.toString(),
      });

      ////visiteur/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (req.params?.nameCard === "visiteur") {
      const pipeline = [
        {
          $match: {
            api_token: api_tokenUsder,
          },
        },
        {
          $unwind: "$visitors",
        },
        {
          $match: {
            $expr: {
              $gte: [
                "$visitors.dateLastVisit",
                {
                  $dateSubtract: {
                    startDate: new Date(),
                    unit: unit,
                    amount: amount,
                  },
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
          },
        },
      ];

      const result = await Usertracker.aggregate(pipeline).exec();
      let resVisiteur = 0;
      if (result.length == 0) {
        resVisiteur = 0;
      } else {
        resVisiteur = result[0].totalSessions;
      }

      res.status(200).json({
        res: resVisiteur.toString(),
      });

      //////page///////////////////////////////////////////////////////////////////////////////////////////
    } else if (req.params?.nameCard === "page") {
      const pipeline = [
        { $match: { api_token: api_tokenUsder } },
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
                        in: { $size: "$$tracker.clicks" },
                      },
                    },
                  },
                },
              },
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
                        in: {
                          $concatArrays: ["$$value", "$$this.clicks.path"],
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
          $unwind: "$clickPaths",
        },
        {
          $group: {
            _id: "$clickPaths",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null, // Utiliser null pour regrouper tous les résultats en un seul groupe
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
            result: { $arrayToObject: [[{ k: "results", v: "$results" }]] }, // Convertir le tableau de résultats en un objet avec la clé "results"
          },
        },
      ];

      const result = await Usertracker.aggregate(pipeline).exec();
      let resVisiteur = 0;
      if (result.length == 0) {
        resVisiteur = 0;
      } else {
        resVisiteur = result[0].totalSessions;
      }

      res.status(200).json({
        res: resVisiteur.toString(),
      });
    } else {
      getKPI(req, res);
    }
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
}

module.exports = { getKPI, kpiChoice };
