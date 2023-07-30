let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { generateJWTAndCookie } = require("./utils/jwt");
const Usertracker = require("../models/Usertracker");

describe("Update User Profil", () => {
    beforeEach(() => {
        sinon.restore();
    });

    describe("PATCH /users/:id", () => {
        it("should update the user (email and/or website)", async () => {
            const mockUser = {
                id: 100,
                email: "unittest@test.com",
                password: bcrypt.hashSync("password123", 10),
                api_token: "token_api",
                role: "user",
                website: "firstwebsite.com"
            };

            const newUser = {
                id: 100,
                email: "testingunit@test.com",
                password: bcrypt.hashSync("password123", 10),
                api_token: "token_api",
                role: "user",
                website: "secondwebsite.com"
            };

            const newData = {
                email: "testingunit@test.com",
                website: "secondwebsite.com"
            };

            sinon.stub(User, "findOne").resolves(mockUser);

            sinon.stub(User, "update").resolves([1, [newUser]]);

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);

            const res = await chai
                .request(server)
                .patch("/users/100")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send(newData);

            expect(res).to.have.status(200);
        });

        it("should return 401 when unauthorized (no token)", async () => {
            const newData = {
                email: "testingunit@test.com",
                website: "secondwebsite.com"
            };

            const res = await chai
                .request(server)
                .patch("/users/100")
                .send(newData);

            expect(res).to.have.status(401);
        });
    });
});
