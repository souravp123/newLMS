import jwt from "jsonwebtoken";
import Video from "database/models/video";

export default async function handler(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "No authorization token" });
  }

  const { courseId } = req.query;

  switch (req.method) {
    case "GET":
      await handleGet(req, res, courseId);
      break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}

const handleGet = async (req, res, courseId) => {
  try {
    const groupNames = await Video.findAll({
      where: { courseId },
      attributes: ['group_name'],
      group: ['group_name'],
    });

    const groupNamesArray = groupNames.map(group => group.group_name);

    res.status(200).json(groupNamesArray);
  } catch (e) {
    res.status(400).json({
      error_code: "fetch_group_names",
      message: e.message
    });
  }
};
