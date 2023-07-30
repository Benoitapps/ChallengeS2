const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const server = require("../server");
const sinon = require("sinon");
const { User } = require("../db");
const { KpiName } = require("../db");
const { generateJWTAndCookie } = require("./utils/jwt");

chai.use(chaiHttp);

describe("KPI", () => {
    beforeEach(() => {
        sinon.restore();
    });
    describe("getKPI", () => {
        it("avec param", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                body: {
                    apiToken: "msxakqaxk28r8uz9xueof7rhvsj56tii",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            chai.request(server)
                .get("/kpi")
                .send(req.body)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("sans api token vide", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                body: {
                    apiToken: "",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            chai.request(server)
                .get("/kpi")
                .send(req.body)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe("KpiChoice", () => {
        it("avec param", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    resperiod: "24h",
                    nameCard: "Sessions",
                },
                body: {
                    apiToken: "msxakqaxk28r8uz9xueof7rhvsj56tii",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            chai.request(server)
                .post("/kpi/post/:nameCard/:resperiod")
                .send(req.params, req.body)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("sans body", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    resperiod: "24h",
                    nameCard: "Sessions",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            chai.request(server)
                .post("/kpi/post/:nameCard/:resperiod")
                .send(req.params)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("sans param", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            chai.request(server)
                .post("/kpi/post/:nameCard/:resperiod")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("getKpiUser BDD", () => {
        it("avec info", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    id: "msxakqaxk28r8uz9xueof7rhvsj56tii",
                },
            };

            sinon.stub(User, "findOne").resolves([
                {
                    id: 1,
                    name: "Sessions",
                },
            ]);

            const { token, cookieOptions } = generateJWTAndCookie(user);

            const res = await chai
                .request(server)
                .get("/kpi/bdd/:id")
                .send(req.params)
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(500);
        });
    });
    describe("getKpiNotUser BDD", () => {
        it("avec info", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    id: "msxakqaxk28r8uz9xueof7rhvsj56tii",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            const res = await chai
                .request(server)
                .get("/kpi/bddnot/:id")
                .send(req.params)
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(500);
        });
    });
    describe("AddKpiToUser BDD", () => {
        it("mauvais param", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    userId: "3tspucnwtebczm7eaenyqmmybsllam9m",
                    kpiName: "Sessions",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            const res = await chai
                .request(server)
                .post("/kpi/addbdd/:userId/:kpiNameId")
                .send(req.params)
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(500);
        });
        it("pas trouver ", async () => {
            const user = {
                id: 1234,
                email: "admin@gmail.com",
                password:
                    "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
                website: "test",
                role: "admin",
                is_verified: true,
                api_token: "set0at5361jq1yyckb84074khmqxryi7",
                createdAt: "2023-07-29T13:31:38.099Z",
                updatedAt: "2023-07-29T13:31:38.099Z",
            };

            const req = {
                params: {
                    userId: "msxakqaxk28r8uz9xueof7rhvsj56tii",
                    kpiNameId: "Sessions",
                },
            };

            const { token, cookieOptions } = generateJWTAndCookie(user);

            const res = await chai
                .request(server)
                .post("/kpi/addbdd/:userId/:kpiNameId")
                .send(req.params)
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);
            console.log(res.body);

            expect(res).to.have.status(500);
        });
        
        //   it("bon param", async () => {
        //     // Données de test pour les utilisateurs fictifs
        //     const user =
        //       {
        //           id: 1234,
        //           email: "admin@gmail.com",
        //           password: "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
        //           website: "test",
        //           role: "admin",
        //           is_verified: true,
        //           api_token: "set0at5361jq1yyckb84074khmqxryi7",
        //           createdAt: "2023-07-29T13:31:38.099Z",
        //           updatedAt: "2023-07-29T13:31:38.099Z",
        //         }

        //         const req = {
        //           params: {
        //               userId :"msxakqaxk28r8uz9xueof7rhvsj56tii",
        //               kpiNameId : "Sessions"

        //           },
        //       };
        //       sinon.stub(User, "findOne").resolves([{

        //           id: 1234,
        //           email: "admin@gmail.com",
        //           password: "$2b$10$IILtdwp3z0gE9D.O90/zN.8YomdADgFg8ihRcFZrd/RKz9eYAPzfC",
        //           website: "test",
        //           role: "admin",
        //           is_verified: true,
        //           api_token: "msxakqaxk28r8uz9xueof7rhvsj56tii",
        //           createdAt: "2023-07-29T13:31:38.099Z",
        //           updatedAt: "2023-07-29T13:31:38.099Z",
        //     }]);

        //     sinon.stub(KpiName, "findOne").resolves([{

        //       id: 14,
        //       name : "Sessions"
        // }]);

        //     const { token, cookieOptions } = generateJWTAndCookie(user);

        //     const res = await chai.request(server).post("/kpi/addbdd/:userId/:kpiNameId").send(req.params).set("Cookie", [`token=${token}; ${cookieOptions}`]);
        //     console.log(res.body);

        //     expect(res).to.have.status(200);

        //   });
    });
});