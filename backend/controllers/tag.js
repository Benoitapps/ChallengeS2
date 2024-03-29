const Tag = require("../db").Tag;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local", override: true });
const generateToken = require("../utils/generateToken");

function create(req, res) {
  const token = req.cookies["token"];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;
  Tag.create({
    name: req.body.label,
    token: generateToken(8),
    userId: userId,
  });

  res.status(201).json({
    name: req.body.label,
    token: generateToken(8),
    userId: userId,
  });
}

function all(req, res) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;

  Tag.findAll({
    where: {
      userId: userId,
    },
  })
    .then((tags) => {
      tags = tags.map((tag) => {
        if(tag.dataValues) {
          tag = tag.dataValues;
          delete tag.userId;
          return tag;
        } else {
          return tag;
        }
      });
      res.status(200).json(tags);
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
}

async function deleteItem(req, res) {
  const token = req.cookies["token"];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;
  const tagId = req.params.id;

  let tag = await Tag.findOne({
    where: {
      id: tagId,
    },
  });

  if (tag.userId !== userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  Tag.destroy({
    where: {
      id: tagId,
      userId: userId,
    },
  })
    .then(() => {
      res.status(200).json({
        message: "Tag supprimé avec succès",
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
}

async function getTag(req, res) {
  try {
    const { apiToken } = req.body;
    const api_tokenUser = apiToken;

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
                              $eq: ["$$tag.eventType", "click"],
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
                                  input: "$$this.tags",
                                  as: "tag",
                                  cond: {
                                    $eq: ["$$tag.eventType", "click"],
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
            $arrayToObject: [[{ k: "results", v: "$results" }]],
          },
        },
      },
    ];

    const result = await Usertracker.aggregate(pipeline).exec();
    const resTagsClicks = result[0];

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
                              $eq: ["$$tag.eventType", "mouseover"],
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
                                  input: "$$this.tags",
                                  as: "tag",
                                  cond: {
                                    $eq: ["$$tag.eventType", "mouseover"],
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
            $arrayToObject: [[{ k: "results", v: "$results" }]],
          },
        },
      },
    ];

    const result2 = await Usertracker.aggregate(pipeline2).exec();
    const resTagsOver = result2[0];

    res.status(200).json({
      resTagsClicks: resTagsClicks,
      resTagsOver: resTagsOver,
    });
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
}

async function updateName(req, res) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;
  let data = JSON.parse(req.body);
  const tagId = req.params.id;
  const newName = data.name;
  try {
    await Tag.update(
      {
        name: newName,
      },
      {
        where: {
          id: parseInt(tagId),
          userId: userId,
        },
      }
    );

    res.status(200).json({ message: "Tag name updated" });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { create, all, deleteItem, updateName, getTag };
