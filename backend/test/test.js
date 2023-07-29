let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");

// signup
describe("User", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("with valid data", () => {
		it("should create a new user and return success message", async () => {
			// Données de test
			const userData = {
				email: "test@test.com",
				password: "password123",
				website: "test.com",
			};

			// Configuration du mock pour User.findOne pour simuler qu'aucun utilisateur existant avec l'email fourni n'est trouvé
			sinon.stub(User, "findOne").resolves(null);

			// Configuration du mock pour User.create pour simuler la création d'un nouvel utilisateur
			sinon.stub(User, "create").resolves({
				email: userData.email,
				password: "hashed_password",
				website: userData.website,
				api_token: "api_token",
			});

			// Appeler la route /signup avec les données de test
			const res = await chai
				.request(server)
				.post("/signup")
				.send(userData);

			// Vérifier le code de statut de réponse
			expect(res).to.have.status(201);

			// Vérifier le corps de la réponse (message de succès)
			expect(res.body)
				.to.have.property("message")
				.eql("Utilisateur créé !");
		});
	});

	describe("with invalid data", () => {
		it("should return 400 when missing parameters", async () => {
			// Pas de données de test ici car la requête est invalide (paramètres manquants)

			// Appeler la fonction signup avec une requête invalide
			const res = await chai.request(server).post("/signup").send({});

			// Vérifier la réponse attendue
			expect(res).to.have.status(400);
			expect(res.body)
				.to.have.property("error")
				.eql("Missing parameters");
		});

		it("should return 400 when password is too short", async () => {
			// Les données de test
			const req = {
				body: {
					email: "test@test.com",
					password: "pass", // Le mot de passe est trop court (moins de 8 caractères)
					website: "test.com",
				},
			};

			// Appeler la fonction signup avec une requête invalide
			const res = await chai
				.request(server)
				.post("/signup")
				.send(req.body);

			// Vérifier la réponse attendue
			expect(res).to.have.status(400);
			expect(res.body)
				.to.have.property("error")
				.eql("Le mot de passe doit contenir entre 8 et 32 caractères.");
		});

		it("should return 400 when user with email already exists", async () => {
			// Les données de test
			const req = {
				body: {
					email: "test@test.com",
					password: "password123",
					website: "test.com",
				},
			};

			// Configuration du mock pour User.findOne
			const findOneMock = sinon.stub(User, "findOne").resolves({
				email: req.body.email,
				password: "hashed_password",
				website: req.body.website,
				api_token: "api_token",
			});

			// Appeler la fonction signup avec une requête invalide (utilisateur avec email déjà existant)
			const res = await chai
				.request(server)
				.post("/signup")
				.send(req.body);

			// Vérifier la réponse attendue
			expect(res).to.have.status(400);
			expect(res.body)
				.to.have.property("error")
				.eql("Adresse mail incorrecte");

			// Vérifier que le mock a été appelé avec les bonnes données
			expect(
				findOneMock.calledOnceWithExactly({
					where: { email: req.body.email },
				})
			).to.be.true;
		});
	});
});
