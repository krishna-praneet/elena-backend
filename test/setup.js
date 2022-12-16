import pathService from "../src/services/impl/path.service.js";
import { MAP_WALK_SETTINGS } from "../src/utils/constants.js";

before(async () => {
    await pathService.init(MAP_WALK_SETTINGS);
});
