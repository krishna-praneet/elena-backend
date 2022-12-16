import { expect } from "chai";
import pathService from "../../src/services/impl/path.service.js";
import { assert } from "chai";
import { MAP_WALK_SETTINGS } from "../../src/utils/constants.js";

describe("Test path service preconditions", function () {
    it("should initialize the path service", (done) => {
        assert(pathService != null);
        done();
    });
});

describe("Test path service", function () {
    describe("test calculateRequestPath", function () {
        
        it("should calculate the path with minimum elevation gain", async () => {
            console.log("in here");
            let start = {
                lat: 42.45808962230291,
                lng: -72.58232659001386,
            };
            let end = {
                lat: 42.350762204006095,
                lng: -72.52745364644278,
            };
            let percent = 0.2;
            let res = await pathService.calculateRequestPath(start, end, percent, false);
            console.log("RES RETURNED");
            // console.log(res);
            assert(res != null);
            assert(res.path != null);
            expect(res.elevationGain).to.be.equal(77);
        });

        it("should calculate the path with maximum elevation gain", async () => {
            console.log("in max here");
            let start = {
                lat: 42.45808962230291,
                lng: -72.58232659001386,
            };
            let end = {
                lat: 42.350762204006095,
                lng: -72.52745364644278,
            };
            let percent = 0.2;
            let res = await pathService.calculateRequestPath(start, end, percent, true);
            assert(res != null);
            assert(res.path != null);
            expect(res.elevationGain).to.be.equal(77);
        });

        it("should calculate the path with DFS with closer start and end points", async () => {
            console.log("in here");
            
            let start = {
                lat: 42.3935967,
                lng: -72.5261905,
            };
            
            let end = {
                lat: 42.3907461,
                lng: -72.5253126,
            };

            let percent = 0.2;
            let res = await pathService.calculateRequestPath(start, end, percent, false);
            
            console.log("RES RETURNED");
            
            assert(res != null);
            assert(res.path != null);


        });
    });


});
