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
            password: bcrypt.hashSync("password123", 10),
        };
        sinon.stub(User, "findOne").resolves(mockUser);

        const userData = {
            email: "test@test.com",
            password: "password123",
        };

        const res = await chai.request(server).post("/login").send(userData);

        expect(res).to.have.status(200);

        expect(res.body).to.have.property("token").to.be.a("string");
    });

    it("should return 401 when user is not found", async () => {
        const userData = {
            email: "nonexistent@test.com",
            password: "password123",
        };

        sinon.stub(User, "findOne").resolves(null);

        const res = await chai.request(server).post("/login").send(userData);

        expect(res).to.have.status(401);

        expect(res.body)
            .to.have.property("error")
            .eql("Utilisateur ou Mot de passe incorrect!");
    });

    it("should return 401 when user is not verified", async () => {
        const userData = {
            email: "test@test.com",
            password: "password123",
        };

        sinon.stub(User, "findOne").resolves({
            id: 1,
            email: userData.email,
            password: "hashed_password",
            is_verified: false,
            role: "user",
            api_token: "api_token",
        });

        const res = await chai.request(server).post("/login").send(userData);

        expect(res).to.have.status(401);

        expect(res.body)
            .to.have.property("error")
            .eql("Votre compte doit être validé par un administrateur");
    });

    it("should return 401 when incorrect password is provided", async () => {
        const userData = {
            email: "test@test.com",
            password: "incorrect_password",
        };

        sinon.stub(User, "findOne").resolves({
            id: 1,
            email: userData.email,
            password: "hashed_password",
            is_verified: true,
            role: "user",
            api_token: "api_token",
        });

        const res = await chai.request(server).post("/login").send(userData);

        expect(res).to.have.status(401);

        expect(res.body)
            .to.have.property("error")
            .eql("Utilisateur ou Mot de passe incorrect!");
    });

    it("should return 400 when email and password are missing", async () => {
        const res = await chai.request(server).post("/login").send({});

        expect(res).to.have.status(400);

        expect(res.body).to.have.property("error").eql("Missing parameters");
    });
});
