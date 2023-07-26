const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const ChartsName = require("../db").ChartsName;
const generateToken = require('../utils/generateToken');

async function getChartsUser(req, res) {//apiToken
    const token = req.cookies.token;

    try {
        const userToken = req.params.id;

        const user = await User.findOne({
            where: { api_token: userToken },
            include: [ChartsName], // Inclure le modèle ChartsName dans la requête
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const chartsNames = user.ChartsNames.map((chartsName) => chartsName.name);

        res.json({ userToken, chartsNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
}

async function getChartsNotUser(req, res) {
    const token = req.cookies.token;

    try {
        const userToken = req.params.id;

        const user = await User.findOne({
            where: { api_token: userToken },
            include: [ChartsName], // Inclure le modèle ChartsName dans la requête
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Récupérer tous les charts disponibles
        const allChartsNames = await ChartsName.findAll();

        // Récupérer les noms des charts liés à l'utilisateur
        const userChartsNames = user.ChartsNames.map((chartsName) => chartsName.name);


        // Filtrer les charts non liés à l'utilisateur
        const unlinkedChartsNames = allChartsNames.filter(
            (chartsName) => !userChartsNames.includes(chartsName.name)
        );

        // Récupérer uniquement les noms des charts non liés à l'utilisateur
        const unlinkedChartsNamesOnly = unlinkedChartsNames.map((chartsName) => chartsName.name);

        res.json({ userToken, unlinkedChartsNames: unlinkedChartsNamesOnly });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function addChartsToUser(req, res) {
    const userApi = req.params.userId; // Utilisez "userId" au lieu de "const { userId, chartsNameId } = req.params;"
    const chartsNameId = req.params.chartsNameId; // Utilisez "chartsNameId" au lieu de "const { userId, chartsNameId } = req.params;"
    console.log(req.params);

    try {
        const user = await User.findOne({ where: { api_token: userApi } });
        const chartsName = await ChartsName.findOne({ where: { name: chartsNameId } });

        if (!user || !chartsName) {
            return res.status(404).json({ message: "Utilisateur ou ChartsName non trouvé." });
        }

        await user.addChartsName(chartsName);

        res.json({ message: "ChartsName ajouté à l'utilisateur avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function removeChartsFromUser(req, res) {
    const userApi = req.params.userId;
    const chartsNameId = req.params.chartsNameId;

    try {
        const user = await User.findOne({ where: { api_token: userApi } });
        const chartsName = await ChartsName.findOne({ where: { name: chartsNameId } });

        if (!user || !chartsName) {
            return res.status(404).json({ message: "Utilisateur ou ChartsName non trouvé." });
        }

        await user.removeChartsName(chartsName);

        res.json({ message: "ChartsName supprimé de l'utilisateur avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function getAllChartsNames(req, res) {
    try {
        const chartsNames = await ChartsName.findAll();

        res.json(chartsNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { getChartsUser, addChartsToUser,removeChartsFromUser, getAllChartsNames, getChartsNotUser };
      