import jwt from "jsonwebtoken";
import Video from "database/models/video";

export default async function handler(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "No authorization token" });
  }

  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "POST":
      await handlePost(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}

const handleGet = async (req, res) => {
  const { courseId } = req.query;
  try {
    const groupNames = await Video.findAll({
      where: { courseId },
      attributes: group_name,
      group: group_name,
    });



    res.status(200).json(groupNames);
  } catch (e) {
    res.status(400).json({
      error_code: "fetch_group_names",
      message: e.message
    });
  }
};


const handlePost = async (req, res) => {
  const {
    group_name,
    title,
    thumb,
    video,
    video_length,
    is_preview,
    short_id,
    courseId,
  } = req.body;

  const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
  try {

    const maxShortIdEntry = await Video.findOne({
      where: { courseId: courseId },
      order: [['short_id', 'DESC']],
    });

    // Get the current maximum short_id, default to 0 if no entry is found
    const maxShortId = maxShortIdEntry ? maxShortIdEntry.short_id : 0;

    // Calculate the new short_id by adding the given short_id to the max one
    const newShortId = maxShortId + 1;

    await Video.create({
      group_name,
      title,
      thumb,
      video,
      video_length,
      is_preview,
      short_id: newShortId,
      courseId,
      userId,
    });

    res.status(200).json({ message: "Video Uploaded Successfully." });
  } catch (e) {
    res.status(400).json({
      error_code: "upload_video",
      message: e.message
    });
  }
};
