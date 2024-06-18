import express from "express";
import videoRouter from "./routes/videos.js";
import cors from "cors";
import dotenv from "dotenv/config";
import fs from "fs";

let { PORT } = process.env;
PORT = PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/videos", videoRouter);

app.get("/healthcheck", (_req, res) => {
	res.send("Express is healthy!");
});

// start Express on port 8080
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
