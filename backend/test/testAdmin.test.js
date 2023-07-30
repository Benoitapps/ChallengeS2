const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");
const sinon = require("sinon");
const { User } = require("../db");
const { generateJWTAndCookie } = require("./utils/jwtAdmin");

chai.use(chaiHttp);

describe("Admin", () => {
    describe("Admin return User", () => {
        it("should return non-verified users", async () => {
            const admin = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
            };

            const usersData = [
                {
                    id: 2222,
                    email: "trainer@gmail.com",
                    password:
                        "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                    website: "test",
                    role: "admin",
                    is_verified: true,
                    api_token: "set0at5361jq1yyckb84074khmqxryi7",
                    createdAt: "2023-07-29T13:31:38.099Z",
                    updatedAt: "2023-07-29T13:31:38.099Z",
                },
                {
                    id: 223,
                    email: "traine11r@gmail.com",
                    password:
                        "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                    website: "test",
                    role: "admin",
                    is_verified: false,
                    api_token: "set0at5361jq1yyckb84074khmqxryi7",
                    createdAt: "2023-07-29T13:31:38.099Z",
                    updatedAt: "2023-07-29T13:31:38.099Z",
                },
            ];

            sinon.stub(User, "findAll").resolves(usersData);

            const { token, cookieOptions } = generateJWTAndCookie(admin);

            const res = await chai
                .request(server)
                .get("/admin/notverified")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(403);

            User.findAll.restore();
        });
    });
});
