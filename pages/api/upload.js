import multer from "multer";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};
let timestamp, randomText ;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { type } = req.query;
    cb(null, type==='video'?(process.env.NODE_ENV === "production"?process.env.VIDEO_PATH_PROD:process.env.VIDEO_PATH):(process.env.NODE_ENV === "production"?process.env.IMAGE_PATH_PROD:process.env.IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    const { type } = req.query;
	const fileExtension = file.originalname.split('.').pop();
    cb(null, `${type}_${randomText}_${timestamp}.${fileExtension}`);
  },
});

const upload = multer({ storage });

export default async function handler(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "No authorization token" });
  }

  switch (req.method) {
    case "POST":
	timestamp = Date.now();
	randomText = crypto.randomBytes(4).toString('hex');
    const { type } = req.query;
    upload.single(`${type}`)(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: `Failed to upload ${type}` + err});
        }
        res.status(200).json({ fileName:`${type}_${randomText}_${timestamp}.${req.file.filename.split('.').pop()}`,message: "File Uploaded Successfully." });
    });
      break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}
