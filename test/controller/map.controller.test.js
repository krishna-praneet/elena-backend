import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../src/index.js";
import mapController from "../../src/controller/map.controller.js";
import { assert } from "chai";

const should = chai.should();
chai.use(chaiHttp);

describe("Test map controller", () => {
    describe("Test preconditions", () => {
        it("should initialize the controller", (done) => {
            assert(mapController != null);
            done();
        });

        it("should get error response when max elevation request is invalid", (done) => {
            let reqBody = {};
            chai.request(server)
                .post("/api/v1/elena/walk/max")
                .send(reqBody)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message").eql("INVALID_REQUEST");
                    done();
                });
        });

        it("should get error response when min elevation request is invalid", (done) => {
            let reqBody = {};
            chai.request(server)
                .post("/api/v1/elena/walk/min")
                .send(reqBody)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message").eql("INVALID_REQUEST");
                    done();
                });
        });
    });

    describe("Test api end points", () => {
        // before((done) => setTimeout(done, 30000));
        it("should get the path with maximum elevation", (done) => {
            let reqBody = {
                start: { coordinates: [42.45808962230291, -72.58232659001386] },
                end: { coordinates: [42.350762204006095, -72.52745364644278] },
                percentage: 0.2,
            };

            chai.request(server)
                .post("/api/v1/elena/walk/max")
                .send(reqBody)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("path");
                    res.body.should.have.property("elevationGain");
                    res.body.should.have.property("distance");
                    res.body.should.have.property("shortestDistance");
                    done();
                });
        });

        it("should get the path with minimum elevation", (done) => {
            let reqBody = {
                start: { coordinates: [42.45808962230291, -72.58232659001386] },
                end: { coordinates: [42.350762204006095, -72.52745364644278] },
                percentage: 0.2,
            };

            chai.request(server)
                .post("/api/v1/elena/walk/min")
                .send(reqBody)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("path");
                    res.body.should.have.property("elevationGain");
                    res.body.should.have.property("distance");
                    res.body.should.have.property("shortestDistance");
                    done();
                });
        });
    });
});
