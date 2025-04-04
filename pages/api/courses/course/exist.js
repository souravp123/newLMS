import { Enrolment, User } from "database/models";
import { parse } from 'cookie';

export default async function handler(req, res) {
	const { userId, courseId } = req.query;
	try {
		if (userId) {
			const cookies = parse(req.headers.cookie || '');
			const sessionToken = cookies.session_token;
			const user = await User.findOne({ where: { session_token: sessionToken } });
			if (user === null) {
				return res.status(200).json("unauthorized");
			}
		}
		let enroll;
		enroll = await Enrolment.findOne({
			where: { userId: userId, courseId: courseId },
		});

		if (enroll) {
			enroll = true;
		} else {
			enroll = false;
		}

		res.status(200).json({
			enroll,
		});
	} catch (e) {
		res.status(400).json({
			error_code: "get_course",
			message: e.message,
		});
	}
}
