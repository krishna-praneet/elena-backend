import express, { json } from "express";
import "dotenv/config";
import cors from "cors";

import Logger from "./utils/logger.js";
import mapRoutes from "./routes/map.router.js";

const port = process.env.PORT;
const env = process.env.NODE_ENV;

const LOGGER = Logger("index.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/elena", mapRoutes);

app.get("/", async (req, res) => {
    res.send("Hello World");
});

app.all("*", (req, res) => {
    res.status(404).send("resource not found");
});

app.listen(port, () => {
    // console.log(`Server Listening on ${port}`);
    LOGGER.info(`Server Listening on ${port}`);
});
