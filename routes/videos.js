import express from "express";
import fs from "fs";
const router = express.Router();

// function that will allow us to 'read' from the JSON file holding API data

function readVideoDetails() {
	const videosFile = fs.readFileSync("data/videos.json");
	const videosDetails = JSON.parse(videosFile);
	return videosDetails;
}

router.get("/", (_req, res) => {
	const videosDetails = readVideoDetails();
	const videoData = videosDetails.map((video) => {
		return {
			id: video.id,
			title: video.title,
			channel: video.channel,
			image: video.image,
		};
	});
	res.json(videoData);
});

router.get("/:id", (req, res) => {
	const videoId = req.params.id;
	const videoDetails = readVideoDetails();
	const video = videoDetails.find((v) => v.id === videoId);

	if (video) {
		res.status(200).json(video);
	} else {
		res.status(404).send("No video with that id exists");
	}
});

export default router;
