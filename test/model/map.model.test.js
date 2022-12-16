// import { assert } from "chai";
// import createGraph from "ngraph.graph";
// import mapModel from "../../src/model/map.model.js";
// import { MAP_WALK_SETTINGS } from "../../src/utils/constants.js";

// let graph = createGraph();
// describe("Test map Model", () => {
//     describe("Test map model preconditions", () => {
//         it("should initialize the map model", (done) => {
//             assert(mapModel != null);
//             done();
//         })

//         it("should initialize empty graph", (done) => {
//             assert(graph != null);
//             let count = 0;
//             graph.forEachNode(node => {
//                 count += 1;
//             })
//             assert(count == 0);
//             done(); 
//         })
//     })

//     it("should populate the graph", async () => {
//         mapModel.generateGraph(MAP_WALK_SETTINGS, graph);
//         assert(graph != null);
//         assert(graph.getLinksCount != 0);
//         assert(graph.getNodesCount != 0);
//     })

//     it("should get elevations from api", async () => {
//         let result = mapModel.getElevations(graph);
//         assert(result != null)
//         console.log("Result")
//         console.log(result)
//         assert(result.length != 0);
//     })

    
// })