import path from 'path';
import fs from 'fs';
import Course_Asset from "database/models/course_asset";
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    if (!("authorization" in req.headers)) {
        return res.status(401).json({ message: "No authorization token" });
    }

    switch (req.method) {
        case "GET":
            await handleGet(req, res);
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

const handleGet = async (req, res) => {
    console.log("Handle GET request");
    const { id: assetId } = req.query;
    console.log("Received Asset ID==========>:", assetId);

    try {
        const courseAsset = await Course_Asset.findOne({ where: { id: assetId } });
        console.log("Course Asset===============>:", courseAsset);

        if (!courseAsset) {
            return res.status(404).json({ message: "File not found" });
        }

        const assetsPath = process.env.ASSETS_PATH;
        const filePath = path.join(assetsPath, courseAsset.lecture_file);

        console.log("File path:===============>", filePath);
        
        if (fs.existsSync(filePath)) {
            console.log("File exists:===================>", filePath);
            const fileContent = fs.readFileSync(filePath);

            res.setHeader('Content-Disposition', `attachment; filename=${courseAsset.lecture_file}`);
            res.setHeader('Content-Type', 'application/pdf');
            res.status(200).send(fileContent);
        } else {
            console.log("File does not exist:===============>", filePath);
            res.status(404).json({ message: "File not found" });
        }
    } catch (e) {
        console.error("Error in file downloading:", e);
        res.status(500).json({
            error_code: "file_download_error",
            message: e.message,
        });
    }
};
