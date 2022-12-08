// import { APIRespose } from "../models/api-response.model";
import pathService from "../services/impl/path.service.js";
import { WALK_settings } from "../utils/constants.js";
import Logger from "../utils/logger.js";
pathService.init(WALK_settings);

const LOGGER = Logger("index.js");
class MapController {
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
