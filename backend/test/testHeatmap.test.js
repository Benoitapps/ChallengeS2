const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const server = require("../server");
const { expect } = chai;
const User = require('../db').User;

chai.use(chaiHttp);

const HeatmapCtrl = require("../controllers/heatmap");
const Usertracker = require("../models/Usertracker");
const Image = require("../db").Image;

const { generateJWTAndCookie } = require("./utils/jwt");

describe("Heatmap Routes", () => {
    beforeEach(() => {
        sinon.stub(Image, "create").resolves({
            name: "image_name",
            src: "image_src",
            api_token: "api_token",
        });
        sinon.stub(Image, "update").resolves({
            name: "image_name",
            src: "new_image_src",
            api_token: "api_token",
        });
        sinon.stub(Image, "findAll").resolves([
            {
                name: "image_name",
                src: "image_src",
            },
        ]);
        mockUser = {
            id: 1,
            email: "test@test.com",
            password: "password123",
            api_token: "api_token",
        };

        ({ token, cookieOptions } = generateJWTAndCookie(mockUser));
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("POST /heatmap/", () => {
        it("should return heatmap data for clicks", async () => {
            const aggregateStub = sinon.stub(Usertracker, "aggregate").returns({
                exec: async () => [
                    {
                        result: {
                            results: [
                                {
                                    path: "/path1",
                                    coordinates: [{ x: 10, y: 20, value: 1 }],
                                },
                            ],
                        },
                    },
                ],
            });

            const apiToken = "api_token";
            const res = await chai
                .request(server)
                .post("/heatmap/")
                .send({ apiToken })
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("resPage");

            aggregateStub.restore();
        });
    });

    describe("POST /heatmap/mouse", () => {
        it("should return heatmap data for mouse movements", async () => {
            sinon.stub(Usertracker, "aggregate").returns({
                exec: async () => [
                    {
                        result: {
                            results: [
                                {
                                    path: "/path1",
                                    coordinates: [{ x: 10, y: 20, value: 1 }],
                                },
                            ],
                        },
                    },
                ],
            });
            const apiToken = "api_token";
            const res = await chai
                .request(server)
                .post("/heatmap/mouse")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ apiToken });
            
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("resPageMouse");
        });
    });

    describe("POST /heatmap/upload", () => {
        it("should upload or replace an image", async () => {
            sinon.stub(User, "findOne").resolves(mockUser);
            const image = "image_data";
            const name = "image_name";
            const res = await chai
                .request(server)
                .post("/heatmap/upload")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ image, token, name });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message");
        });
    });

    describe("POST /heatmap/upload/get", () => {
        it("should get all images for a user", async () => {
            const apiToken = "api_token";
            const res = await chai
                .request(server)
                .post("/heatmap/upload/get")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ apiToken });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("image");
        });
    });

    describe("POST /heatmap/upload/getOne", () => {
        it("should get one image for a user", async () => {
            const apiToken = "api_token";
            const name = "image_name";
            const res = await chai
                .request(server)
                .post("/heatmap/upload/getOne")
                .set("Cookie", [`token=${token}; ${cookieOptions}`])
                .send({ apiToken, name });

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal([ { name: 'image_name', src: 'image_src' } ]);
        });
    });
});
