import haversine from "haversine";
import manhattan from "manhattan-distance";

/**
 * Calculates the haversine distance between two points
 * @param {*} start The coordinates of the start point
 * @param {*} end The coordinates of the end point
 * @returns the haversine distance between the start and end
 */
export function harversine_heuristic(start, end) {
    let startCoords = {
        latitude: start.data.coordinates[0],
        longitude: start.data.coordinates[1],
    };

    let endCoords = {
        latitude: end.data.coordinates[0],
        longitude: end.data.coordinates[1],
    };

    return haversine(startCoords, endCoords, { unit: "meter" });
}

/**
 * Calculates the euclidean distance between two points
 * @param {*} start The coordinates of the start point
 * @param {*} end The coordinates of the end point
 * @returns the euclidean distance between the start and end
 */
export function euclideanDistance_hueristic(start, end) {
    let dx = start.data.coordinates[0] - end.data.coordinates[1];
    let dy = start.data.coordinates[0] - end.data.coordinates[1];

    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the manhattan distance between two points
 * @param {*} start The coordinates of the start point
 * @param {*} end The coordinates of the end point
 * @returns the manhattan distance between start and end
 */
export function manhattan_heuristic(start, end) {
    return (
        manhattan(
            start.data.coordinates[0],
            start.data.coordinates[1],
            end.data.coordinates[0],
            end.data.coordinates[1]
        ).slice(0, -2) * 1000
    );
}
