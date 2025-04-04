// api/stream.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // if (!("authorization" in req.headers)) {
  //   return res.status(401).json({ message: "No authorization token" });
  // }

  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}

const handleGetRequest = async (req, res) => {
  const { videoName } = req.query;
  const videoPath = (process.env.NODE_ENV === "production" ? process.env.VIDEO_PATH_PROD : process.env.VIDEO_PATH) + "/" + videoName; // Update with the actual path to your video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
      // 'Authorization': req.headers.authorization, // Include the Authorization header
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      // 'Authorization': req.headers.authorization, // Include the Authorization header
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};
