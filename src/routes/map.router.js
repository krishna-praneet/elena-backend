import express from "express";
import MapController from "../controller/map.controller.js";

const router = express.Router();

router.post("/walk/min", async (req, res, next) => {
    await MapController.getMinElevationPath(req, res, next);
});

router.post("/walk/max", async (req, res, next) => {
    await MapController.getMaxElevationPath(req, res, next);
});

export default router;
