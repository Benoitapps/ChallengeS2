// Assurez-vous d'importer correctement les modules nécessaires (chai, chai-http, server, sinon, User)

const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");
const sinon = require("sinon");
const { User } = require("../db"); // Assurez-vous d'importer correctement le modèle User ou l'interface de la base de données que vous utilisez

chai.use(chaiHttp);

describe("Admin", () => {
  describe("Admin return User", () => {
    it("should return non-verified users", async () => {
      // Données de test pour les utilisateurs fictifs
      const usersData = [
        {
          id: 2222,
          email: "trainer@gmail.com",
          password: "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
          website: "test",
          role: "user",
          is_verified: true,
          api_token: "set0at5361jq1yyckb84074khmqxryi7",
          createdAt: "2023-07-29T13:31:38.099Z",
          updatedAt: "2023-07-29T13:31:38.099Z",
        },
        {
            id: 223,
            email: "traine11r@gmail.com",
            password: "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
            website: "test",
            role: "user",
            is_verified: false,
            api_token: "set0at5361jq1yyckb84074khmqxryi7",
            createdAt: "2023-07-29T13:31:38.099Z",
            updatedAt: "2023-07-29T13:31:38.099Z",
          },
        // Ajoutez plus d'utilisateurs non vérifiés ici si nécessaire
      ];
      
      sinon.stub(User, "findAll").resolves(usersData);
      
      // Effectuez votre requête pour obtenir les utilisateurs non vérifiés
      const res = await chai.request(server).get("/admin/notverified");
      console.log(res.body);
      
      // Vérifiez la réponse renvoyée par l'API
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array"); // La réponse est un tableau
      expect(res.body).to.deep.equal(usersData); // Comparez directement avec les utilisateurs fictifs
      
      // Restaurez User.findAll après le test pour éviter les effets secondaires dans les autres tests
      User.findAll.restore();
    });
  });
});
