
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import Video from "database/models/video";

export default async function handler(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "No authorization token" });
  }

  switch (req.method) {
    case "POST":
      await handlePost(req, res);
      break;
    case "GET":
      await handleGet(req, res);
      break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}


const handlePost = async (req, res) => {
  const { short_id, courseId, ...video } = req.body;

  try {
    const existingVideo = await Video.findOne({
      where: { courseId, short_id },
    });

    if (existingVideo) {
      const maxShortId = await Video.max("short_id", { where: { courseId } });
      const nextAvailableShortId = (maxShortId || 0) + 1;

      await existingVideo.update({ short_id: nextAvailableShortId });
      console.log(`Existing video ${existingVideo.id} moved to short_id ${nextAvailableShortId}`);
    }

    const newVideo = await Video.create({ short_id, courseId, ...video });
    console.log("New Video Created:", newVideo);

    const updatedVideos = await Video.findAll({
      where: { courseId },
      order: [["short_id", "ASC"]],
    });

    res.status(201).json({ message: "Video uploaded successfully",updatedVideos });
    console.log(updatedVideos)
  } catch (error) {
    console.error("Error in handlePost:", error);
    res.status(400).json({ error_code: "upload_video", message: error.message });
  }
};





const handleGet = async (req, res) => {
  const { courseId } = req.query;
  try {
    const videos = await Video.findAll({
      where: { courseId },
      order: [['short_id', 'ASC']]
    });


    console.log("Fetched Videos:", videos);


    let newSortId = 1;
    
    for (const video of videos) {
      if (video.short_id !== newSortId) {
        console.log(`Updating video ${video.id}: short_id ${video.short_id} -> ${currentShortId}`);
        video.short_id = newSortId;
        await video.save(); 
      }
      newSortId++; 
    }
    const maxSortId = await Video.max('short_id', {
      where: { courseId }
    });

    const nextSortId = (maxSortId || 0) + 1;
    res.status(200).json(nextSortId);
  } catch (e) {
    res.status(400).json({
      error_code: "fetch_sort_id",
      message: e.message
    });
  }
};
