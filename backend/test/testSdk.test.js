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

describe("SDK", () => {
    let userData;
    let tagData;

    beforeEach(() => {
        userData = {
            id: 1,
            email: "test@test.com",
            password: bcrypt.hashSync("password123", 10),
            api_token: "api_token",
            role: "user"
        };
        tagData = [
            {
                id: 1,
                name: "tag1",
                token: "token1",
            }
        ];

        sinon.stub(User, "findOne").resolves(userData);
        sinon.stub(Tag, "findAll").resolves(tagData);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("with valid data", () => {
        it("should save data", async () => {
            const trackersData = {
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
            };

            chai.request(server)
                .post("/sdk")
                .send(trackersData)
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("with invalid data", () => {
        it("should return 401 when user not find", async () => {
            const trackersData401 = {
                api_token: "test",
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
            };

            chai.request(server)
                .post("/sdk")
                .send(trackersData401)
                .then((res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it("should return 500 when sending data failed", async () => {
            const trackersData500 = {
                api_token: "",
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
            };

            chai.request(server)
                .post("/sdk")
                .send(trackersData500)
                .then((res) => {
                    expect(res).to.have.status(500);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});