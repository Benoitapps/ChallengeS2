let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");
const bcrypt = require("bcrypt");

describe("POST /login", () => {
    beforeEach(() => {
        sinon.restore();
    });

    it("should login an existing user with correct credentials", async () => {
        const mockUser = {
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10), // Hashed password for the mock user
        };
        sinon.stub(User, "findOne").resolves(mockUser);

        // Données de test
        const userData = {
            email: "test@test.com",
            password: "password123",
        };

        // Appeler la route /login avec les données de test
        const res = await chai.request(server).post("/login").send(userData);

        // Vérifier le code de statut de réponse
        expect(res).to.have.status(200);

        // Vérifier que la réponse contient l'ID de l'utilisateur et le token
        expect(res.body).to.have.property("token").to.be.a("string");
    });

    it("should return 401 when user is not found", async () => {
        // Données de test
        const userData = {
            email: "nonexistent@test.com",
            password: "password123",
        };

        // Configuration du mock pour User.findOne pour simuler qu'aucun utilisateur n'est trouvé
        sinon.stub(User, "findOne").resolves(null);

        // Appeler la route /login avec les données de test
        const res = await chai.request(server).post("/login").send(userData);

        // Vérifier le code de statut de réponse
        expect(res).to.have.status(401);

        // Vérifier le message d'erreur
        expect(res.body)
            .to.have.property("error")
            .eql("Utilisateur ou Mot de passe incorrect!");
    });

    it("should return 401 when user is not verified", async () => {
        // Données de test
        const userData = {
            email: "test@test.com",
            password: "password123",
        };

        // Configuration du mock pour User.findOne pour simuler qu'un utilisateur existant est trouvé, mais non vérifié
        sinon.stub(User, "findOne").resolves({
            id: 1,
            email: userData.email,
            password: "hashed_password",
            is_verified: false,
            role: "user",
            api_token: "api_token",
        });

        // Appeler la route /login avec les données de test
        const res = await chai.request(server).post("/login").send(userData);

        // Vérifier le code de statut de réponse
        expect(res).to.have.status(401);

        // Vérifier le message d'erreur
        expect(res.body)
            .to.have.property("error")
            .eql("Votre compte doit être validé par un administrateur");
    });

    it("should return 401 when incorrect password is provided", async () => {
        // Données de test
        const userData = {
            email: "test@test.com",
            password: "incorrect_password",
        };

        // Configuration du mock pour User.findOne pour simuler qu'un utilisateur existant est trouvé
        sinon.stub(User, "findOne").resolves({
            id: 1,
            email: userData.email,
            password: "hashed_password",
            is_verified: true,
            role: "user",
            api_token: "api_token",
        });

        // Appeler la route /login avec les données de test
        const res = await chai.request(server).post("/login").send(userData);

        // Vérifier le code de statut de réponse
        expect(res).to.have.status(401);

        // Vérifier le message d'erreur
        expect(res.body)
            .to.have.property("error")
            .eql("Utilisateur ou Mot de passe incorrect!");
    });

    it("should return 400 when email and password are missing", async () => {
        // Appeler la route /login avec une requête invalide (paramètres manquants)
        const res = await chai.request(server).post("/login").send({});

        // Vérifier le code de statut de réponse
        expect(res).to.have.status(400);

        // Vérifier le message d'erreur
        expect(res.body).to.have.property("error").eql("Missing parameters");
    });
});
