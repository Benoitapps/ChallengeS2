let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
const Tag = require("../db").Tag;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { generateJWTAndCookie } = require("./utils/jwt");

describe("Auth Middleware", () => {
    it("should allow access to protected route with valid JWT cookie", async () => {
        const mockUser = {
            id: 1,
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10),
            api_token: "api_token",
            role: "user",
        };
        sinon.stub(User, "findOne").resolves(mockUser);

        const mockTags = [
            {
                id: 1,
                name: "tag1",
                token: "token1",
                userId: 1,

            },
            {
                id: 2,
                name: "tag2",
                token: "token2",
                userId: 1,
            }
        ]
        sinon.stub(Tag, "findAll").resolves(mockTags);

        const { token, cookieOptions } = generateJWTAndCookie(mockUser);

        const res = await chai
            .request(server)
            .get("/tags")
            .set("Cookie", [`token=${token}; ${cookieOptions}`]);

        expect(res).to.have.status(200);
    });

    it("should deny access to protected route without JWT cookie", async () => {
        const res = await chai.request(server).get("/tags");

        expect(res).to.have.status(401);
    });
});
