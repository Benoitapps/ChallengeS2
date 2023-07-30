const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const server = require("../server");
const Tunnel = require("../db").Tunnel;
const TunnelTag = require("../db").TunnelTag;
const Usertracker = require("../models/Usertracker");
const { generateJWTAndCookie } = require("./utils/jwt");

chai.use(chaiHttp);

describe("Tunnel Routes", () => {
    let token, cookieOptions, mockUser;

    before(async () => {
        mockUser = {
            id: 1,
            email: "test@test.com",
            password: "password123",
        };
        ({ token, cookieOptions } = generateJWTAndCookie(mockUser));
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("POST /tunnels/create", () => {
        it("should create a new tunnel and return success message", async () => {
            const decodedToken = {
                userId: mockUser.id,
            };
            sinon.stub(jwt, "verify").returns(decodedToken);

            const requestBody = {
                tunnel: "Test Tunnel",
                tags: [
                    { id: 1, position: 1 },
                    { id: 2, position: 2 },
                ],
            };

            let mockTunnel = {
                id: 1,
                name: "Test Tunnel",
                userId: mockUser.id,
            };

            sinon.stub(Tunnel, "create").resolves(mockTunnel);
            sinon.stub(TunnelTag, "create").resolves();

            const res = await chai
                .request(server)
                .post("/tunnels/create")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send(requestBody);

            expect(res).to.have.status(201);
            expect(res.body).to.deep.equal(mockTunnel);
        });

        it("should return 401 when unauthorized (no token)", async () => {
            const res = await chai.request(server).post("/tunnels/create");

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({ error: "Authentification requise !" });
        });
    });


    describe("GET /tunnels", () => {
        it("should return all tunnels for the user", async () => {
            sinon.stub(Tunnel, "findAll").resolves({ id: 1, name: "Test Tunnel", userId: mockUser.id });

            const res = await chai
                .request(server)
                .get("/tunnels")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                id: 1,
                name: "Test Tunnel",
                userId: mockUser.id,
            });
        });

        it("should return 401 when unauthorized (no token)", async () => {
            const res = await chai.request(server).get("/tunnels");

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({ error: "Authentification requise !" });
        });
    });

    describe("DELETE /tunnels/delete/:id", () => {
        it("should delete a tunnel", async () => {
            sinon.stub(TunnelTag, "destroy").resolves({ id: 1, name: "Test Tunnel", userId: mockUser.id});
            sinon.stub(Tunnel, "destroy").resolves({ id: 1, name: "Test Tunnel", userId: mockUser.id });

            const res = await chai
                .request(server)
                .delete("/tunnels/delete/1")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ message: "Tunnel deleted" });
        });

        it("should return 401 when unauthorized (no token)", async () => {
            const res = await chai.request(server).delete("/tunnels/delete/1");

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({ error: "Authentification requise !" });
        });
    });
});
