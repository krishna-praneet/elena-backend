import haversine from "haversine";
import manhattan from "manhattan-distance";
// let manhattan = require("manhattan-distance");

/**
 * Calculates the haversine distance between two points
 * @param {*} start The coordinates of the start point
 * @param {*} end The coordinates of the end point
 * @returns the haversine distance between the start and end
 */
export function harversine_heuristic(start, end) {
    let startNode = {
        latitude: start.data.coordinates[0],
        longitude: start.data.coordinates[1],
    };

    let endNode = {
        latitude: end.data.coordinates[0],
        longitude: end.data.coordinates[1],
    };

    return haversine(startNode, endNode, { unit: "meter" });
}

//normal distance formula
//best for any movements
export function euclideanDistance_hueristic(fromNode, toNode) {
    let dx = fromNode.data.coordinates[0] - toNode.data.coordinates[1];
    let dy = fromNode.data.coordinates[0] - toNode.data.coordinates[1];

    return Math.sqrt(dx * dx + dy * dy);
}

//wrosen the result
//best for grid like where we have perfect grid like coordinates in the map which line among the x,y coordinates
export function manhattan_heuristic(fromNode, toNode) {
    //manhattan distance
    return (
        manhattan(
            fromNode.data.coordinates[0],
            fromNode.data.coordinates[1],
            toNode.data.coordinates[0],
            toNode.data.coordinates[1]
        ).slice(0, -2) * 1000
    );
}

// export default { harversine_heuristic, manhattan_heuristic, euclideanDistance_hueristic };
