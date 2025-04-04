import { Course_Progress } from "@/database/models";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await handleGet(req, res);
            break;
        case "POST":
            await handlePost(req, res);
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

const handlePost = async (req, res) => {
    const { userId, courseId, videoId, finished } = req.body;
    try {
        const progress = await Course_Progress.findOne({
            where: { userId, courseId, videoId },
        });

        if (!progress) {
            await Course_Progress.create({
                userId,
                courseId,
                videoId,
                finished,
            });
        } else {
            await Course_Progress.update(
                { finished },
                { where: { userId, courseId, videoId } }
            );
        }

        res.status(200).json({ success: true });
    } catch (e) {
        res.status(400).json({
            error_code: "update_progress",
            message: e.message,
        });
    }
};

const handleGet = async (req, res) => {
    const { userId, courseId } = req.query;

    if (!userId || !courseId) {
        return res.status(400).json({
            error_code: "missing_parameters",
            message: "userId and courseId are required",
        });
    }

    try {
        const progressEntries = await Course_Progress.findAll({
            where: { userId, courseId },
        });

        res.status(200).json({
            success: true,
            courseProgress: progressEntries, 
        });
    } catch (e) {
        res.status(400).json({
            error_code: "fetch_progress_error",
            message: e.message,
        });
    }
};
