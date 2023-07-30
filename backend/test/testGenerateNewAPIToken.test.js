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

describe("Generate New API Key (api_token)", () => {
    beforeEach(() => {
        sinon.restore();
    });

    describe("PATCH /userstoken/:id", () => {
        it("should generate a new API key for the user", async () => {
            const mockUser = {
                id: 100,
                email: "unittest@test.com",
                password: bcrypt.hashSync("password123", 10),
                api_token: "old_token",
                role: "user",
            };

            const mockResult = {
                acknowledged: true,
                modifiedCount: 1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1
            };
            sinon.stub(User, "findOne").resolves(mockUser);

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);

            sinon.stub(Usertracker, "updateMany").resolves({ mockResult });

            sinon.stub(User, "update").resolves([1]);

            const res = await chai
                .request(server)
                .patch("/userstoken/100")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ oldToken: "old_token", newToken: "new_token" });

            expect(res).to.have.status(200);
        });
        

        it("should return 404 when no user is updated in postreSQL (user not found)", async () => {
            const mockUser = {
                id: 100,
                email: "unittest@test.com",
                password: bcrypt.hashSync("password123", 10),
                api_token: "old_token",
                role: "user",
            };

            const mockResult = {
                acknowledged: true,
                modifiedCount: 1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1
            };
            sinon.stub(User, "findOne").resolves(mockUser);

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);

            sinon.stub(Usertracker, "updateMany").resolves({ mockResult });

            sinon.stub(User, "update").resolves([0]);

            const res = await chai
                .request(server)
                .patch("/userstoken/100")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ oldToken: "old_token", newToken: "new_token" });

            expect(res).to.have.status(404);
        });

        it("should return 401 when unauthorized (no token)", async () => {
            const res = await chai
                .request(server)
                .patch("/userstoken/100")
                .send({ oldToken: "old_token", newToken: "new_token" });

            expect(res).to.have.status(401);
        });
    });
});
