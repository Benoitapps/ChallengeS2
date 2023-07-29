let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should(); // ! ne pas supprimer
chai.use(chaiHttp);
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateJWTAndCookie(user) {
    const token = jwt.sign(
        {
            userToken: user.api_token,
            userEmail: user.email,
            userRole: user.role,
            userId: user.id,
        },
        "RANDOM_TOKEN_SECRET",
        { expiresIn: "24h" }
    );

    // Créer le cookie contenant le token JWT
    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: false,
        signed: false,
    };

    return { token, cookieOptions };
}

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
