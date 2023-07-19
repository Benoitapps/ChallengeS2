const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware');
const services = '../services/user'
const User = require("../db").User;
const KpiName = require("../db").KpiName;
const generateToken = require('../utils/generateToken');

async function getKpiUser(req, res) {//apiToken
    const token = req.cookies.token;
  
    try {
        const userToken = req.params.id;
    
        const user = await User.findOne({
          where: { api_token: userToken },
          include: [KpiName], // Inclure le modèle KpiName dans la requête
        });
    
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
    
        const kpiNames = user.KpiNames.map((kpiName) => kpiName.name);
    
        res.json({ userToken, kpiNames });
      } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
      }
    };

    async function getKpiNotUser(req, res) {
      const token = req.cookies.token;
    
      try {
        const userToken = req.params.id;
    
        const user = await User.findOne({
          where: { api_token: userToken },
          include: [KpiName], // Inclure le modèle KpiName dans la requête
        });
    
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
    
        // Récupérer tous les KPI disponibles
        const allKpiNames = await KpiName.findAll();
    
        // Récupérer les noms des KPI liés à l'utilisateur
        const userKpiNames = user.KpiNames.map((kpiName) => kpiName.name);
       
    
        // Filtrer les KPI non liés à l'utilisateur
        const unlinkedKpiNames = allKpiNames.filter(
          (kpiName) => !userKpiNames.includes(kpiName.name)
        );
    
        // Récupérer uniquement les noms des KPI non liés à l'utilisateur
        const unlinkedKpiNamesOnly = unlinkedKpiNames.map((kpiName) => kpiName.name);
    
        res.json({ userToken, unlinkedKpiNames: unlinkedKpiNamesOnly });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    };
  
    async function addKpiToUser(req, res) {
        const userApi = req.params.userId; // Utilisez "userId" au lieu de "const { userId, kpiNameId } = req.params;"
        const kpiNameId = req.params.kpiNameId; // Utilisez "kpiNameId" au lieu de "const { userId, kpiNameId } = req.params;"
        console.log(req.params);
      
        try {
          const user = await User.findOne({ where: { api_token: userApi } });
          const kpiName = await KpiName.findOne({ where: { name: kpiNameId } });
      
          if (!user || !kpiName) {
            return res.status(404).json({ message: "Utilisateur ou KpiName non trouvé." });
          }
      
          await user.addKpiName(kpiName);
      
          res.json({ message: "KpiName ajouté à l'utilisateur avec succès." });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      }

      async function removeKpiFromUser(req, res) {
        const userApi = req.params.userId;
        const kpiNameId = req.params.kpiNameId;
      
        try {
          const user = await User.findOne({ where: { api_token: userApi } });
          const kpiName = await KpiName.findOne({ where: { name: kpiNameId } });
      
          if (!user || !kpiName) {
            return res.status(404).json({ message: "Utilisateur ou KpiName non trouvé." });
          }
      
          await user.removeKpiName(kpiName);
      
          res.json({ message: "KpiName supprimé de l'utilisateur avec succès." });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      }
      
      async function getAllKpiNames(req, res) {
        try {
          const kpiNames = await KpiName.findAll();
      
          res.json(kpiNames);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      }
    
     
      module.exports = { getKpiUser, addKpiToUser,removeKpiFromUser, getAllKpiNames, getKpiNotUser };
      