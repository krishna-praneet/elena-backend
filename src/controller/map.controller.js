// import { APIRespose } from "../models/api-response.model";
import pathService from "../services/impl/path.service.js";
import { MAP_WALK_SETTINGS } from "../utils/constants.js";
import Logger from "../utils/logger.js";
pathService.init(MAP_WALK_SETTINGS);

const LOGGER = Logger("index.js");
class MapController {
    /**
     *
     * @param {*} req {"start":{"coordinates":[]},"end":{"coordinates":[]},"percentage":}
     * req body containing the start and end coordinates along with the percentage deviation
     * @param {*} res 
     * {
            path: x, // The path with the minimum elevation gain
            elevationGain: x, // The elevation gained in the path
            distance: x, // The total length of the path
            shortestDistance: x, //The shortest path between the start and end coordinates
        }
     * @param {*} next
     * @returns 
     */
    async getMinElevationPath(req, res, next) {
        let startCoordiantes = req.body["start"]?.coordinates;
        let endCordinates = req.body["end"]?.coordinates;
        let deviation = req.body["percentage"];

        if (startCoordiantes != undefined && endCordinates != undefined) {
            try {
                let source = {
                    lat: startCoordiantes[0],
                    lng: startCoordiantes[1],
                };
                let dest = {
                    lat: endCordinates[0],
                    lng: endCordinates[1],
                };
                let result = await pathService.calculateRequestPath(source, dest, deviation, false);
                return res.status(200).json(result);
            } catch (error) {
                LOGGER.error("Failed to get path with minimum elevation gain ", error);
                if (typeof error === "string") {
                    return res.status(400).json({ status: 400, message: error.toUpperCase() });
                } else if (error instanceof Error) {
                    return res.status(400).json({ status: 400, message: error.message });
                } else {
                    return res.status(400).json({ status: 400, message: "INTERNAL_SERVER_ERROR" });
                }
            }
        } else {
            LOGGER.error("Request body invalid");
            return res.status(400).json({ status: 400, message: "INVALID_REQUEST" });
        }
    }

    /**
     *
     * @param {*} req {"start":{"coordinates":[]},"end":{"coordinates":[]},"percentage":}
     * req body containing the start and end coordinates along with the percentage deviation
     * @param {*} res 
     * {
            path: x, // The path with the maximum elevation gain
            elevationGain: x, // The elevation gained in the path
            distance: x, // The total length of the path
            shortestDistance: x, //The shortest path between the start and end coordinates
        }
     * @param {*} next
     * @returns 
     */
    async getMaxElevationPath(req, res, next) {
        let startCoordiantes = req.body["start"]?.coordinates;
        let endCordinates = req.body["end"]?.coordinates;
        let deviation = req.body["percentage"];

        if (startCoordiantes != undefined && endCordinates != undefined) {
            try {
                let source = {
                    lat: startCoordiantes[0],
                    lng: startCoordiantes[1],
                };
                let dest = {
                    lat: endCordinates[0],
                    lng: endCordinates[1],
                };
                let result = await pathService.calculateRequestPath(source, dest, deviation, true);
                return res.status(200).json(result);
            } catch (error) {
                LOGGER.error("Failed to get path with maximum elevation gain ", error);
                if (typeof error === "string") {
                    return res.status(400).json({ status: 400, message: error.toUpperCase() });
                } else if (error instanceof Error) {
                    return res.status(400).json({ status: 400, message: error.message });
                } else {
                    return res.status(400).json({ status: 400, message: "INTERNAL_SERVER_ERROR" });
                }
            }
        } else {
            LOGGER.error("Request body invalid");
            return res.status(400).json({ status: 400, message: "INVALID_REQUEST" });
        }
    }
}

export default new MapController();
