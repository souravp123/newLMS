import { Video, Course_Progress, User } from "@/database/models";
import { parse } from 'cookie';

export default async function handler(req, res) {
	const { id, userId, courseId } = req.query;
	try {
		const video = await Video.findOne({ where: { id: id } });
		if (video && userId) {
			const cookies = parse(req.headers.cookie || '');
			const sessionToken = cookies.session_token;
			const user = await User.findOne({ where: { session_token: sessionToken } });
			if (user === null) {
				return res.status(200).json("unauthorized");
			}
			const progress = await Course_Progress.findOne({
				where: { userId: userId, courseId: courseId, videoId: id },
			});
			if (!progress) {
				await Course_Progress.create({
					finished: true,
					userId,
					courseId,
					videoId: id,
				});
			}
		}

		res.status(200).json({
			video,
		});
	} catch (e) {
		res.status(400).json({
			error_code: "get_videos",
			message: e.message,
		});
	}
}
