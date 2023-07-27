const Tag = require("../db").Tag;
const jwt = require('jsonwebtoken');

const generateToken = require('../utils/generateToken');

function create(req, res) {
  const token = req.cookies["token"];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  Tag.create({
    name: req.body.label,
    token: generateToken(8),
    userId: userId,
  })

  res.status(201).json({
    name: req.body.label,
    token: generateToken(8),
    userId: userId,
  });
}

function all(req, res) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // ! RANDOM_TOKEN_SECRET dans env
  const userId = decodedToken.userId;

  Tag.findAll({
    where: {
      userId: userId
    }
  }).then((tags) => {
    tags = tags.map((tag) => {
      tag = tag.dataValues;
      delete tag.userId;
      return tag;
    });
    res.status(200).json(tags);
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });
}

function deleteItem(req, res) {
  const token = req.cookies["token"];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  const tagId = req.params.id;

  Tag.destroy({
    where: {
      id: tagId,
      userId: userId
    }
  }).then(() => {
    res.status(200).json({
      message: "Tag supprimé avec succès"
    });
  }).catch((err) => {
    res.status(500).json({
      err
    });
  });
}

async function getTag(req, res) {
  try {
    console.log("GetTag");
    const { apiToken } = req.body
    console.log("body", apiToken)
    const api_tokenUser = apiToken;
    console.log("api_tokenUser", api_tokenUser);

    /////////Tags event click, clics par tag
    const pipeline = [
      {
        $match: {
          api_token: api_tokenUser,
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

    const result = await Usertracker.aggregate(pipeline).exec();
    const resTagsClicks = result[0]

    console.log("resTagsClicks " + resTagsClicks);
    console.log(resTagsClicks);


    ///////Tags event mouseover, clics par tag
    const pipeline2 = [
      {
        $match: {
          api_token: api_tokenUser,
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

    const result2 = await Usertracker.aggregate(pipeline2).exec();
    const resTagsOver = result2[0]

    console.log("resTagsOver " + resTagsOver);
    console.log(resTagsOver);

    let timeStamp = 1688999649562
    var dateformat = new Date(timeStamp);
    var dateformattoday = new Date()

    console.log("dateformat" + dateformat);
    console.log("dateformattoday1= " + dateformattoday.setHours(dateformattoday.getHours() + 24));
    console.log("dateformattoday2= " + dateformattoday.setDate(dateformattoday.getDate() + 7));
    console.log("dateformattoday3= " + dateformattoday.setDate(dateformattoday.getDate() + 30));
    console.log("dateformattoday4= " + dateformattoday.setMonth(dateformattoday.getMonth() + 12));


    res.status(200).json({
      resTagsClicks: resTagsClicks,
      resTagsOver: resTagsOver
    });
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
}

module.exports = { create, all, deleteItem, getTag };