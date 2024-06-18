import express from "express";
import fs from "fs";
const router = express.Router();

// function that will allow us to 'read' from the JSON file holding API data
function readVideos() {
	const videosFile = fs.readFileSync("./data/videos.json");
	const videosData = JSON.parse(videosFile);
	return videosData;
}

router.get("/", function (req, res) {
	const videosData = readVideos();
	res.json(videosData);
});

// Export the router so that the app can access it from the server.js file
export default router;
