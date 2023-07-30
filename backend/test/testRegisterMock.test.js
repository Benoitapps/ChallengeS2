let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");

describe("User", () => {
    beforeEach(() => {
        sinon.restore();
    });

    describe("with valid data", () => {
        it("should create a new user and return success message", async () => {
            const userData = {
                email: "test@test.com",
                password: "password123",
                website: "test.com",
            };

            sinon.stub(User, "findOne").resolves(null);

            sinon.stub(User, "create").resolves({
                email: userData.email,
                password: "hashed_password",
                website: userData.website,
                api_token: "api_token",
            });

            const res = await chai
                .request(server)
                .post("/signup")
                .send(userData);

            expect(res).to.have.status(201);

            expect(res.body)
                .to.have.property("message")
                .eql("Utilisateur créé !");
        });
    });

    describe("with invalid data", () => {
        it("should return 400 when missing parameters", async () => {

            const res = await chai.request(server).post("/signup").send({});

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("Missing parameters");
        });

        it("should return 400 when password is too short", async () => {
            const req = {
                body: {
                    email: "test@test.com",
                    password: "pass",
                    website: "test.com",
                },
            };

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("Le mot de passe doit contenir entre 8 et 32 caractères.");
        });

        it("should return 400 when user with email already exists", async () => {
            const req = {
                body: {
                    email: "test@test.com",
                    password: "password123",
                    website: "test.com",
                },
            };

            const findOneMock = sinon.stub(User, "findOne").resolves({
                email: req.body.email,
                password: "hashed_password",
                website: req.body.website,
                api_token: "api_token",
            });

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("Adresse mail incorrecte");

            expect(
                findOneMock.calledOnceWithExactly({
                    where: { email: req.body.email },
                })
            ).to.be.true;
        });

        it("should return 400 when password is too long", async () => {
            const req = {
                body: {
                    email: "test@test.com",
                    password: "a".repeat(383),
                    website: "test.com",
                },
            };

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("Le mot de passe doit contenir entre 8 et 32 caractères.");
        });

        it('should return 400 when email is missing "@"', async () => {
            const req = {
                body: {
                    email: "testtest.com",
                    password: "password123",
                    website: "test.com",
                },
            };

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("L'adresse e-mail est invalide.");
        });

        it('should return 400 when email is missing "."', async () => {
            const req = {
                body: {
                    email: "test@testcom",
                    password: "password123",
                    website: "test.com",
                },
            };

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("L'adresse e-mail est invalide.");
        });

        it('should return 400 when email is missing both "@" and "."', async () => {
            const req = {
                body: {
                    email: "testtestcom",
                    password: "password123",
                    website: "test.com",
                },
            };

            const res = await chai
                .request(server)
                .post("/signup")
                .send(req.body);

            expect(res).to.have.status(400);
            expect(res.body)
                .to.have.property("error")
                .eql("L'adresse e-mail est invalide.");
        });
    });
});
