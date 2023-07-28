const jwt = require("jsonwebtoken");
const Image = require("../db").Image;
const Usertracker = require("../models/Usertracker");
require("dotenv").config({ path: ".env.local", override: true });

async function getHeatmapClic(req, res) {
  try {
    const { apiToken } = req.body;
    const api_tokenUsder = apiToken;

    //session
    const pipeline = [
      { $match: { api_token: api_tokenUsder } },
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
                      in: "$$this.clicks",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$clickPaths" },
      {
        $group: {
          _id: "$clickPaths.path",
          coordinates: {
            $push: {
              x: "$clickPaths.x",
              y: "$clickPaths.y",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          results: {
            $push: {
              path: "$_id",
              coordinates: "$coordinates",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          result: { $arrayToObject: [[{ k: "results", v: "$results" }]] },
        },
      },
    ];

    const result = await Usertracker.aggregate(pipeline).exec();
    const resPages = result.length > 0 ? result[0].result.results : [];

    if (resPages.length > 0) {
      resPages.forEach((element) => {
        element.coordinates.forEach((coord) => {
          coord.value = 0;
          element.coordinates.forEach((coord2) => {
            if (
              coord2.x - 10 <= coord.x &&
              coord.x <= coord2.x + 10 &&
              coord2.y - 10 <= coord.y &&
              coord.y <= coord2.y + 10
            ) {
              coord.value++;
              coord.x = (coord.x * 1136) / 1536;
              coord.y = (coord.y * 570) / 864;
            }
          });
        });
      });
    }

    res.status(200).json({
      resPage: resPages,
    }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function getHeatmapMouse(req, res) {
  try {
    const { apiToken } = req.body;
    const api_tokenUsder = apiToken;

    //session
    const pipeline = [
      { $match: { api_token: api_tokenUsder } },
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
                      in: "$$this.mouse",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$clickPaths" },
      {
        $group: {
          _id: "$clickPaths.path",
          coordinates: {
            $push: {
              x: "$clickPaths.x",
              y: "$clickPaths.y",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          results: {
            $push: {
              path: "$_id",
              coordinates: "$coordinates",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          result: { $arrayToObject: [[{ k: "results", v: "$results" }]] },
        },
      },
    ];

    const result = await Usertracker.aggregate(pipeline).exec();
    const resPages = result.length > 0 ? result[0].result.results : [];

    if (resPages.length > 0) {
      resPages.forEach((element) => {
        element.coordinates.forEach((coord) => {
          coord.value = 0;
          element.coordinates.forEach((coord2) => {
            if (
              coord2.x - 10 <= coord.x &&
              coord.x <= coord2.x + 10 &&
              coord2.y - 10 <= coord.y &&
              coord.y <= coord2.y + 10
            ) {
              coord.value++;
              coord.x = (coord.x * 1136) / 1536;
              coord.y = (coord.y * 570) / 864;
            }
          });
        });
      });
    }

    res.status(200).json({
      resPageMouse: resPages,
    }); // Renvoie le nombre total de clics au format JSON
  } catch (error) {
    res.status(401).json({ error: error.message }); // Gère les erreurs d'authentification ou de token et renvoie l'erreur au format JSON
  }
}

async function uploadImage(req, res) {
  try {
    const { image } = req.body;
    const { token } = req.body;
    const { name } = req.body;

    let imagecree = "";
    const testimage = await Image.findOne({
      where: { api_token: token, name: name },
    });

    if (!testimage) {
      imagecree = Image.create({
        name: name,
        src: image,
        api_token: token,
      });
    } else {
      imagecree = Image.update(
        { src: image },
        { where: { api_token: token, name: name } }
      );
    }

    res.status(200).json({
      message: "Image remplacer ou cree !",
      email: imagecree,
    });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
}

async function getImageSrc(req, res) {
  try {
    const { apiToken } = req.body; // Assuming the API token is passed as a URL parameter

    const image = await Image.findAll({
      where: { api_token: apiToken },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found for this user" });
    }

    res.status(200).json({ image });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve image source" });
  }
}

async function getOneImageSrc(req, res) {
  try {
    const { apiToken } = req.body; // Assuming the API token is passed as a URL parameter
    const { name } = req.body;

    const image = await Image.findOne({
      where: { api_token: apiToken, name: name },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found for this user" });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve image source" });
  }
}

module.exports = {
  getHeatmapClic,
  getHeatmapMouse,
  uploadImage,
  getImageSrc,
  getOneImageSrc,
};
