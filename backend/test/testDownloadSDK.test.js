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

describe("Download the SDK", () => {
    beforeEach(() => {
        sinon.restore();
    });

    describe("GET /downloadsdk", () => {
        it("should return the SDK for download", async () => {
            const mockUser = {
                id: 100,
                email: "unittest@test.com",
                password: bcrypt.hashSync("password123", 10),
                api_token: "token_api",
                role: "user",
            };

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);

            const res = await chai
                .request(server)
                .get("/downloadsdk")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(200);
        });
        

        it("should return 401 when unauthorized (no token)", async () => {
            const res = await chai
                .request(server)
                .get("/downloadsdk");
            expect(res).to.have.status(401);
        });
    });
});
