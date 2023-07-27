const User = require("../db").User;
const TagName = require("../db").TagName;

async function getTagUser(req, res) {
  //apiToken
  try {
    const userToken = req.params.id;

    const user = await User.findOne({
      where: { api_token: userToken },
      include: [TagName], // Inclure le modèle KpiName dans la requête
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tagNames = user.TagNames.map((tagname) => tagname.name);

    res.json({ userToken, tagNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getTagNotUser(req, res) {
  const token = req.cookies.token;

  try {
    const userToken = req.params.id;

    const user = await User.findOne({
      where: { api_token: userToken },
      include: [TagName], // Inclure le modèle KpiName dans la requête
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Récupérer tous les KPI disponibles
    const allTagName = await TagName.findAll();

    // Récupérer les noms des KPI liés à l'utilisateur
    const userKpiNames = user.TagNames.map((tagName) => tagName.name);

    // Filtrer les KPI non liés à l'utilisateur
    const unlinkedTagNames = allTagName.filter(
      (kpiName) => !userKpiNames.includes(kpiName.name)
    );

    // Récupérer uniquement les noms des KPI non liés à l'utilisateur
    const unlinkedTagNamesOnly = unlinkedTagNames.map(
      (kpiName) => kpiName.name
    );

    res.json({ userToken, unlinkedTagNames: unlinkedTagNamesOnly });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function addTagToUser(req, res) {
  const userApi = req.params.userId; // Utilisez "userId" au lieu de "const { userId, kpiNameId } = req.params;"
  const tagNameId = req.params.tagNameId; // Utilisez "kpiNameId" au lieu de "const { userId, kpiNameId } = req.params;"

  try {
    const user = await User.findOne({ where: { api_token: userApi } });
    const tagName = await TagName.findOne({ where: { name: tagNameId } });

    if (!user || !tagName) {
      return res
        .status(404)
        .json({ message: "Utilisateur ou KpiName non trouvé." });
    }

    await user.addTagName(tagName);

    res.json({ message: "KpiName ajouté à l'utilisateur avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function removeTagFromUser(req, res) {
  const userApi = req.params.userId;
  const tagNameId = req.params.tagNameId;

  try {
    const user = await User.findOne({ where: { api_token: userApi } });
    const tagName = await TagName.findOne({ where: { name: tagNameId } });

    if (!user || !tagName) {
      return res
        .status(404)
        .json({ message: "Utilisateur ou tagName non trouvé." });
    }

    await user.removeTagName(tagName);

    res.json({ message: "TagName supprimé de l'utilisateur avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllTag(req, res) {
  try {
    const tagNames = await TagName.findAll();

    res.json(tagNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getTagUser,
  addTagToUser,
  removeTagFromUser,
  getAllTag,
  getTagNotUser,
};
