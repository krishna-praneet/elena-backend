import { assert, expect } from "chai";
import { manhattan_heuristic, euclideanDistance_hueristic } from "../../src/utils/heuristic.js";

describe("Test Heuristic helper functions", () => {
    describe("Testing manhattan distance", () => {
        it("should return correct manhattan distance 1", () => {
            
            let start = {
                data: {
                    coordinates: [42.3935967,-72.5261905]
                }
            };
            
            let end = {
                data: {
                    coordinates: [42.3907461,-72.5253126]
                }
            };

            let res = manhattan_heuristic(start, end);
            assert(res != null);
            expect(res).to.be.equal(410);
        })
    })

    describe("Testing euclidean distance heuristic", () => {
        it("should return correct euclidean distance 1", () => {
            
            let start = {
                data: {
                    coordinates: [42.3935967,-72.5261905]
                }
            };
            
            let end = {
                data: {
                    coordinates: [42.3907461,-72.5253126]
                }
            };

            let res = euclideanDistance_hueristic(start, end);
            assert(res != null);
            expect(res).to.be.equal(162.51988010518363);
        })
    })
})