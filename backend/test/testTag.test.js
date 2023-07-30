const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const tagController = require("../controllers/tag");
const jwt = require("jsonwebtoken");
const server = require("../server");
const Tag = require("../db").Tag;
const User = require("../db").User;
const bcrypt = require("bcrypt");
const { generateJWTAndCookie } = require("./utils/jwt");

chai.use(require("chai-http"));

const generateToken = require("../utils/generateToken");
sinon.stub(generateToken);

describe("Tag Routes", () => {
    afterEach(() => {
        sinon.restore();
    });

    describe("GET /tags", () => {
        it("should return all tags for the user", async () => {
            const mockUser = {
                id: 1,
                email: "test@test.test",
                password: bcrypt.hashSync("password123", 10),
                website: "https://test.test",
                role: "user",
            };

            sinon.stub(User, "findOne").resolves(mockUser);

            const mockTags = [
                {
                    id: 1,
                    name: "tag1",
                    token: "token1",
                    userId: mockUser.id,
                },
                {
                    id: 2,
                    name: "tag2",
                    token: "token2",
                    userId: mockUser.id,
                },
            ];

            sinon.stub(Tag, "findAll").resolves(mockTags);

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);
            const res = await chai
                .request(server)
                .get("/tags")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockTags);
        });

        it("should return 401 when no token is provided", async () => {
            const res = await chai.request(server).get("/tags");

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({
                error: "Authentification requise !",
            });
        });
    });

    describe("POST /tags/create", () => {
        it("should create a new tag and return success message", async () => {
            const mockUser = {
                id: 1,
                email: "test@test.test",
                password: bcrypt.hashSync("password123", 10),
                website: "https://test.test",
            };

            const mockNewTag = {
                name: "tag1",
                token: "generated_token",
                userId: mockUser.id,
            };

            sinon.stub(Tag, "create").resolves(mockNewTag);

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);
            const res = await chai
                .request(server)
                .post("/tags/create")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(201);
        });

        it("should return 401 when no token is provided", async () => {
            const res = await chai.request(server).post("/tags/create");

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({
                error: "Authentification requise !",
            });
        });
    });

    describe("DELETE /tags/delete/:id", () => {
        it("should delete the tag and return success message", async () => {
            const mockUser = {
                id: 1,
                email: "test@test.test",
                password: bcrypt.hashSync("password123", 10),
            };

            sinon.stub(User, "findOne").resolves(mockUser);

            const mockTag = {
                id: 1,
                name: "tag1",
                token: "token1",
                userId: mockUser.id,
            };

            sinon.stub(Tag, "findOne").resolves(mockTag);

            sinon.stub(Tag, "destroy").resolves();

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);
            const res = await chai
                .request(server)
                .delete("/tags/delete/1")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({
                message: "Tag supprimé avec succès",
            });
        });

        it("should return 401 when trying to delete a tag not owned by the user", async () => {
            const mockUser = {
                id: 1,
                email: "test@test.com",
                password: bcrypt.hashSync("password123", 10),
            };

            sinon.stub(User, "findOne").resolves(mockUser);

            const mockTag = {
                id: 1,
                name: "tag1",
                token: "token1",
                userId: 2,
            };

            sinon.stub(Tag, "findOne").resolves(mockTag);

            sinon.stub(Tag, "destroy").resolves();

            const { token, cookieOptions } = generateJWTAndCookie(mockUser);
            const res = await chai
                .request(server)
                .delete("/tags/delete/1")
                .set("Cookie", [`token=${token}; ${cookieOptions}`]);

            expect(res).to.have.status(401);
            expect(res.body).to.deep.equal({ error: "Unauthorized" });
        });
    });

    // describe("PUT /tags/update/:id", () => {
    //     it("should update the tag and return success message", async () => {
    //         const mockUser = {
    //             id: 1,
    //             email: "test@test.com",
    //             password: bcrypt.hashSync("password123", 10),
    //             website: "test.test",
    //         };

    //         sinon.stub(User, "findOne").resolves(mockUser);

    //         const mockTag = {
    //             id: 1,
    //             name: "tag1",
    //             token: "token1",
    //             userId: mockUser.id,
    //         };

    //         sinon.stub(Tag, "findOne").resolves(mockTag);

    //         const updatedTag = {
    //             name: "tag2", // New name for the tag
    //         };

    //         // Stub the Tag.update method to return the updated tag
    //         sinon.stub(Tag, "update").resolves(updatedTag);

    //         const { token, cookieOptions } = generateJWTAndCookie(mockUser);
    //         const res = await chai
    //             .request(server)
    //             .put("/tags/update/1")
    //             .set("Cookie", [`token=${token}; ${cookieOptions}`]); // Send the updated tag data in the request body

    //         expect(res).to.have.status(200);
    //         expect(res.body).to.deep.equal({
    //             message: "Tag mis à jour avec succès",
    //         });
    //     });
    // });
});
