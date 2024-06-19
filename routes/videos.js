import express from "express";
import uniqid from "uniqid";
import fs from "fs";
const router = express.Router();

// function that will allow us to 'read' from the JSON file holding API data

function readVideoDetails() {
	const videosFile = fs.readFileSync("data/videos.json");
	const videosDetails = JSON.parse(videosFile);
	return videosDetails;
}

// function to write or add to our JSON file
function addVideo(data) {
	const stringifiedData = JSON.stringify(data, null, 2);
	fs.writeFileSync("data/videos.json", stringifiedData);
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

router.post("/", (req, res) => {
	const videoDetails = readVideoDetails();
	const newVideo = {
		id: uniqid(),
		title: req.body.title,
		channel: req.body.channel,
		image: req.body.image,
		description: req.body.description,
		views: 0,
		likes: 0,
		duration: "5:35",
		video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
		timestamp: Date.now(),
		comments: [],
	};
	videoDetails.push(newVideo);
	addVideo(videoDetails);
	res.status(201).json(newVideo);
});

router.post("/:id/comments", (req, res) => {
	const videoId = req.params.id;
	const videoDetails = readVideoDetails();
	const video = videoDetails.find((v) => v.id === videoId);

	if (!video) {
		res.status(404).send("Video not found");
	}

	const newComment = {
		id: uniqid(),
		name: req.body.name,
		comment: req.body.comment,
		likes: 0,
		timestamp: Date.now(),
	};

	video.comments.push(newComment);

	try {
		fs.writeFileSync("data/videos.json", JSON.stringify(videoDetails, null, 2));
		res.status(201).json(video.comments);
	} catch (error) {
		res.status(500).send("Error writing to file");
	}
});

router.delete("/:videoId/comments/:commentId", (req, res) => {
	const videoId = req.params.videoId;
	const videoDetails = readVideoDetails();
	const video = videoDetails.find((v) => v.id === videoId);

	if (!video) {
		res.status(404).send("Video not found");
	}
	const commentId = req.params.commentId;
	video.comments = video.comments.filter((c) => c.id !== commentId);

	try {
		fs.writeFileSync("data/videos.json", JSON.stringify(videoDetails, null, 2));
		res.status(204).json(video.comments);
	} catch (error) {
		res.status(500).send("Error writing to file");
	}
});

export default router;
