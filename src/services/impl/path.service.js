import Logger from "../../utils/logger.js";
import haversine from "haversine";
import { harversine_heuristic } from "../../utils/heuristic.js";
import path from "ngraph.path";
import createGraph from "ngraph.graph";
import MapModel from "../../model/map.model.js";

const LOGGER = Logger("path.service.js");
class PathService {
    constructor() {}
    graph;

    async init(settings) {
        this.graph = createGraph();
        await MapModel.generateGraph(settings, this.graph);
    }

    /**
     * Calculates the path with maximum or minimum elevation gained between two
     * coordinates that is within @param percentage of the shortest distance.
     * @param {*} source The {lat, long} coordinates of the source location
     * @param {*} target The {lat, long} coordinates of the target location
     * @param {*} percentage The percentage deviation from shortest path
     * @param {*} isMax boolean parameter to identify if max elevation or min elevation gain is required
     * @returns the path with maximum or minimum elevation gain. Returns null if no path is
     * found or if there is an error.
     *
     */
    async calculateRequestPath(source, target, percentage, isMax) {
        LOGGER.info(
            `Calculating path from coordinates ${source["lat"]}, ${source["lng"]} to coordinates ${target["lat"]}, ${target["lng"]}`
        );
        try {
            let closest = this.closestNode(source, target);
            source = closest.source;
            target = closest.target;

            //compute the shortest path
            let shortestPath = this.findShortestPath(source, target);

            let shortestDistance = this.calculateDistance(shortestPath, false);

            let shortestElevationGain = this.calculateElevations(shortestPath, false);

            //compute the distance between two nodes, if they are 1000 meters long, we only return the shortest paths to limit the computation power

            let s = this.graph.getNode(source);
            let e = this.graph.getNode(target);

            const start = {
                latitude: s.data.coordinates[0],
                longitude: s.data.coordinates[1],
            };

            const end = {
                latitude: e.data.coordinates[0],
                longitude: s.data.coordinates[1],
            };

            let walkDistance = haversine(start, end, { unit: "meter" });

            if (shortestPath.length == 0) {
                LOGGER.warn("No Shortest path found or shortest path lenght is 0");
                return null;
            }

            if (walkDistance > 500 || shortestPath.length > 20) {
                let path = this.pathToEdgeBackWard(shortestPath);
                let nodes = [];
                path.forEach((path) => {
                    let node = this.graph.getNode(path.fromId);
                    nodes.push(node);
                });

                return {
                    path: nodes,
                    elevationGain: shortestElevationGain,
                    distance: shortestDistance,
                    shortestDistance: shortestDistance,
                };
            } else {
                //compute all the paths
                let paths = this.findAllPaths(source, target, shortestPath.length);

                //compute all the elevations
                let elevations = [];
                paths.forEach((path) => {
                    let elevationGain = this.calculateElevations(path, true);
                    elevations.push(elevationGain);
                });
                let plot = -1;
                if (isMax) {
                    let current = Number.MIN_SAFE_INTEGER;
                    elevations.forEach((elevation, index) => {
                        let distance = this.calculateDistance(paths[index], true);

                        if (distance <= shortestDistance * (1 + percentage)) {
                            if (current <= elevation) {
                                current = elevation;
                                plot = index;
                            }
                        }
                    });
                } else {
                    let current = Number.MAX_SAFE_INTEGER;
                    elevations.forEach((elevation, index) => {
                        let distance = this.calculateDistance(paths[index], true);

                        if (distance <= shortestDistance * (1 + percentage)) {
                            if (current >= elevation) {
                                current = elevation;
                                plot = index;
                            }
                        }
                    });
                }

                //return the result
                let elevationGain = elevations[plot];
                let path = paths[plot];
                let dist = this.calculateDistance(path, true);

                return {
                    path: path,
                    elevationGain: elevationGain,
                    distance: dist,
                    shortestDistance: shortestDistance,
                };
            }
        } catch (error) {
            LOGGER.error("Failed to calculate the path", error);
            return null;
        }
    }

    //Utility Functions

    /**
     * Calculates the closest node to source and target nodes
     * @param {*} source The {lat, long} coordinates of the source location
     * @param {*} target The {lat, long} coordinates of the target location
     * @returns the closest node on map to source and target nodes
     */
    closestNode(source, target) {
        try {
            let sourceMin = Number.MAX_SAFE_INTEGER,
                targetMin = Number.MAX_SAFE_INTEGER,
                sourceId = "",
                targetId = "";

            this.graph.forEachNode((node) => {
                if (
                    sourceMin >
                    Math.abs(node.data.coordinates[0] - source["lat"]) +
                        Math.abs(node.data.coordinates[1] - source["lng"])
                ) {
                    sourceMin =
                        Math.abs(node.data.coordinates[0] - source["lat"]) +
                        Math.abs(node.data.coordinates[1] - source["lng"]);
                    sourceId = node.id;
                }
                if (
                    targetMin >
                    Math.abs(node.data.coordinates[0] - target["lat"]) +
                        Math.abs(node.data.coordinates[1] - target["lng"])
                ) {
                    targetMin =
                        Math.abs(node.data.coordinates[0] - target["lat"]) +
                        Math.abs(node.data.coordinates[1] - target["lng"]);
                    targetId = node.id;
                }
            });

            return { source: sourceId, target: targetId };
        } catch (error) {
            LOGGER.error("Failed to find the closest node to the source and target", error);
            return null;
        }
    }

    /**
     * Finds the shortest path between two points
     * @param {*} source The {lat, long} coordinates of the source location
     * @param {*} target The {lat, long} coordinates of the target location
     * @returns finds and returns the shortest path. returns null if no path if sound or
     * there is an error
     */
    findShortestPath(source, target) {
        try {
            LOGGER.info("Finding the shortest path");
            let pathFinder = path.aStar(this.graph, {
                oriented: true,
                distance(fromNode, toNode, link) {
                    return link.data.distance;
                },
                heuristic(fromNode, toNode) {
                    return harversine_heuristic(fromNode, toNode);
                },
            });

            //path is going backward order
            let shortestPath = pathFinder.find(source, target);

            return shortestPath;
        } catch (error) {
            LOGGER.error("Failed to find the shortest path between source and destination", error);
            return null;
        }
    }

    /**
     * Calculates the length of the path
     * @param {*} path the path for which the distance has to be calculated
     * @param {*} isForward boolean to determine if the path is forward or backward
     * @returns the total distance of path in meters
     */
    calculateDistance(path, isForward) {
        LOGGER.info("Calculating distance of a path");
        try {
            let totalDistance = 0;

            //get list of edges
            let edges = isForward ? this.pathToEdgeForWard(path) : this.pathToEdgeBackWard(path);

            edges.forEach((edge) => {
                totalDistance += edge.data.distance;
            });

            return totalDistance;
        } catch (error) {
            LOGGER.error("Failed to calculate distance", error);
            return null;
        }
    }

    /**
     * Finds all the paths with a given maximum length between two points
     * @param {*} source The {lat, long} coordinates of the source location
     * @param {*} target The {lat, long} coordinates of the target location
     * @param {*} maxLength the max length that the path can have
     * @returns
     */
    findAllPaths(source, target, maxLength) {
        try {
            let verticeCount = 0;
            this.graph.forEachNode(function () {
                verticeCount++;
            });

            let s = this.graph.getNode(source);
            let t = this.graph.getNode(target);

            let isVisited = new Array(verticeCount).fill(false);
            let pathList = [];
            let final = [];

            pathList.push(s);

            this.DFSUtil(s, t, isVisited, pathList, final, maxLength);
            return final;
        } catch (error) {
            LOGGER.error(
                "Failed to find all paths that are with x percent of the shortest distance",
                error
            );
            return null;
        }
    }

    /**
     *
     * @param {*} source The {lat, long} coordinates of the source location
     * @param {*} target The {lat, long} coordinates of the target location
     * @param {*} isVisited array to maintain if a node is visited or not
     * @param {*} pathList stores the path in the DFS
     * @param {*} final array to store all the paths
     * @param {*} maxLength the maximum length that the path can have
     * @returns
     */
    DFSUtil(source, target, isVisited, pathList, final, maxLength) {
        if (source === target) {
            final.push([...pathList]);
            return;
        }

        if (source !== target && pathList.length >= maxLength) {
            return;
        }

        isVisited[source.id] = true;

        let adjacent = [];
        graph.forEachLinkedNode(
            source.id,
            (linkedNode) => {
                adjacent.push(linkedNode);
            },
            true
        );

        for (let i = 0; i < adjacent.length; i++) {
            if (!isVisited[adjacent[i].id]) {
                pathList.push(adjacent[i]);
                DFSUtils(adjacent[i], target, isVisited, pathList, final, maxLength);

                pathList.splice(pathList.indexOf(adjacent[i]), 1);
            }
        }

        isVisited[source.id] = false;
    }

    /**
     * Calculates the elevation gained in a path
     * @param {*} path the path for which elevation gain has to be calculated
     * @param {*} isForward boolean parameter to identify if the path is a forward or backward path.
     * @returns the total elevation gained by the path
     */
    calculateElevations(path, isForward) {
        try {
            let elevation = 0;
            let edges = isForward ? this.pathToEdgeForWard(path) : this.pathToEdgeBackWard(path);
            edges.forEach((edge) => {
                if (edge.data.elevation > 0) {
                    elevation += edge.data.elevation;
                }
            });

            return elevation;
        } catch (error) {
            LOGGER.error("Failed to calculate elevation of a path", error);
            return null;
        }
    }

    /**
     *
     * @param {*} path the path for which we have to find edges in the forward direction
     * @returns returns the edges of the path in the forward direction
     */
    pathToEdgeForWard(path) {
        try {
            let edges = [];
            for (let i = 1; i < path.length; i++) {
                let edge = this.graph.getLink(path[i - 1].id, path[i].id);
                edges.push(edge);
            }
            return edges;
        } catch (error) {
            LOGGER.error("Failed to find the forward edges of a path", error);
            return null;
        }
    }

    /**
     *
     * @param {*} path the path for which we have to find edges in the backward direction
     * @returns returns the edges of the path in the backward direction
     */
    pathToEdgeBackWard(path) {
        try {
            let edges = [];

            for (let i = path.length - 1; i > 0; i--) {
                let edge = this.graph.getLink(path[i].id, path[i - 1].id);
                edges.push(edge);
            }
            return edges;
        } catch (error) {
            LOGGER.error("Failed to find the backward edges of a path", error);
            return null;
        }
    }
}

export default new PathService();
