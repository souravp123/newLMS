import fs from 'fs';
import path from 'path';


export default async function handler(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).json({ message: "No authorization token" });
  }
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
  try {
    const { imageName } = req.query; // Assuming you pass the image name as a query parameter

    // Validate imageName or perform any necessary checks

    const imagePath = path.join((process.env.NODE_ENV === "production"?process.env.IMAGE_PATH_PROD:process.env.IMAGE_PATH), imageName); // Path to your images directory

    if (fs.existsSync(imagePath)) {
      const image = fs.readFileSync(imagePath);
      const imageExt = path.extname(imagePath);
      res.setHeader('Content-Type', `image/${imageExt.substring(1)}`);
      res.end(image, 'binary');
    } else {
      res.status(404).end('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).end('Internal Server Error');
  }
};
