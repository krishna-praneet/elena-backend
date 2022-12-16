import MapModel from "../src/model/map.model.js";
// const mapMode = require("../src/model/map.model").MapModel;
import { expect } from "chai";
import mapController from "../src/controller/map.controller";

before(async (done) => {
    console.log("Inhere");
    await pathService.init(MAP_WALK_SETTINGS);
});
