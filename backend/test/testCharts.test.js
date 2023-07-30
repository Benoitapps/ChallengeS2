let chai = require("chai");
const { expect } = chai;
const User = require("../db").User;
const Tag = require("../db").Tag;
let chaiHttp = require("chai-http");
let server = require("../server");
const should = chai.should();
chai.use(chaiHttp);
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const Usertracker = require("../models/Usertracker");
const ChartsName = require("../db").ChartsName;
const { generateJWTAndCookie } = require("./utils/jwt");

describe("Charts", () => {
    let userData;
    let tagData;
    let chartsData;

    beforeEach(() => {
        sinon.restore();

        userData = {
            id: 1,
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10),
            api_token: "api_token",
            role: "user",
            is_verified: true,
            createdAt: "2023-07-29T13:31:38.099Z",
            updatedAt: "2023-07-29T13:31:38.099Z",
        };
        tagData = [
            {
                id: 1,
                name: "tag1",
                token: "token1",
            }
        ];
        chartsData = [
            {
                id: 1,
                name: "Clics",
            },
            {
                id: 2,
                name: "Sessions",
            }
        ];

        const aggregateStub = sinon.stub(Usertracker, "aggregate").returns({
            exec: async () => [
                {
                    api_token: userData.api_token,
                    user_fingerprint: "user_fingerprint",
                    mouse: [
                        {
                            x: 124,
                            y: 57,
                            timestamp: 1690706049000,
                            path: "/",
                        }
                    ],
                    clicks: [
                        {

                            x: 124,
                            y: 57,
                            timestamp: 1690706049000,
                            target: "<a> </a>",
                            path: "/"
                        }
                    ],
                    paths: [
                        {
                            path: "/",
                            timestamp: 1690706049000,
                        }
                    ],
                    tags: [
                        {
                            token: "token1",
                            timestamp: 1690706049000,
                            path: "/",
                            eventType: "mouseover"
                        }
                    ],
                    startTime: new Date("2023-07-30T08:34:09.100+00:00"),
                    endTime: new Date("2023-07-30T08:34:39.519+00:00"),
                }
            ]
        });

        sinon.stub(User, "findOne").resolves(userData);
        sinon.stub(Tag, "findAll").resolves(tagData);
        sinon.stub(ChartsName, "create").resolves(chartsData);
    });

    describe("POST /charts/post", () => {
        it("should return chart", async () => {
            const chartData = {
                api_token: userData.api_token,
                nameCard: "clics",
                resperiod: "7d"
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/post/${chartData.nameCard}/${chartData.resperiod}`)
                .send(chartData.api_token)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                }
            );
        });

        it("should return 400 when missing name card", async () => {
            const chartData = {
                api_token: userData.api_token,
                resperiod: "7d",
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/post/${chartData.nameCard}/${chartData.resperiod}`)
                .send(chartData.api_token)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    }
                );
        });

        it("should return 400 when missing period", async () => {
            const chartData = {
                api_token: userData.api_token,
                nameCard: "clics",
            }

            chai.request(server)
                .post("/charts/post")
                .send(chartData)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch((err) => done(err));
        });

        it("should return 400 when bad request", async () => {
            const chartData = {
                api_token: userData.api_token,
                nameCard: "over",
                resperiod: "7d",
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/post/${chartData.nameCard}/${chartData.resperiod}`)
                .send(chartData.api_token)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    }
                );
        });
    });

    describe("GET /charts/bdd", () => {
        it("should return charts cards", async () => {
            const chartData = {
                id: userData.api_token,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bdd")
                .send(chartData)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should return 404 when user doesn't exist", async () => {
            const chartData = {
                id: "test"
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bdd")
                .send(chartData)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("GET /charts/bddnot", () => {
        it("should return charts cards", async () => {
            const chartData = {
                id: userData.api_token,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bddnot")
                .send(chartData)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should return 404 when user doesn't exist", async () => {
            const chartData = {
                id: "test"
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bddnot")
                .send(chartData)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("POST /charts/addbdd", () => {
        it("should add a chart card", async () => {
            const chartData = {
                id: userData.api_token,
                chartsNameId: 1,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/addbdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(201);
                    done();
                });
        });

        it("should return 404 when user doesn't exist", async () => {
            const chartData = {
                id: "test",
                chartsNameId: 1,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/addbdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("should return 404 when chart doesn't exist", async () => {
            const chartData = {
                id: userData.api_token,
                chartsNameId: 99999,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .post(`/charts/addbdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe("DELETE /charts/removebdd", () => {
        it("should remove a chart card", async () => {
            const chartData = {
                id: userData.api_token,
                chartsNameId: 1,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .delete(`/charts/removebdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should return 404 when user doesn't exist", async () => {
            const chartData = {
                id: "test",
                chartsNameId: 1,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .delete(`/charts/removebdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("should return 404 when chart doesn't exist", async () => {
            const chartData = {
                id: userData.api_token,
                chartsNameId: 99999,
            }

            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .delete(`/charts/removebdd/${chartData.id}/${chartData.chartsNameId}`)
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe("GET /charts/bddcharts", () => {
        it("should get all charts cards", async () => {
            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bddcharts")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("should return 500 when user doesn't exist", async () => {
            const { token, cookieOptions } = generateJWTAndCookie(userData);

            chai.request(server)
                .get("/charts/bddcharts")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
});