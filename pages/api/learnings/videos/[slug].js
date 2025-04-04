import { Video, Course, Enrolment, } from "@/database/models";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export default async function handler(req, res) {
	const { slug } = req.query;
	try {
		const course = await Course.findOne({ where: { slug: slug } });
		if (course) {
			const videos = await Video.findAll({
				order: [["short_id", "ASC"]],
				where: { courseId: course.id },
			}); 
			let isEnrolled = false;
			let progressCount = 0;
			let enrolmentStatus = null;
			let enrollmentEndDate = null;



			if (req.headers.authorization) {
				const { userId } = jwt.verify(
					req.headers.authorization,
					process.env.JWT_SECRET
				);
				try {
					const enrollment = await Enrolment.findOne({
						where: {
							courseId: course.id,
							userId: userId,
							end_date: {
								[Op.gt]: new Date(), 
							},
						},
					});
					// isEnrolled = enrollment !== null;
					if (enrollment) {
						isEnrolled = true;
						enrolmentStatus = enrollment.rz_pay_subscription_status;
						enrollmentEndDate = enrollment.end_date;

					}


					

                    // if (isEnrolled) {
                    //     const progress = await Course_Progress.findAll({
                    //         where: { userId, courseId: course.id, finished: true },
                    //     });
                    //     progressCount = progress.length;
                    // }
				} catch (e) {
					console.error("Enrollment query failed: ", e.message);
				}
				// Determine if the user is enrolled

			}


			res.status(200).json({
				course,
				videos,
				isEnrolled,
				progressCount,
				enrolmentStatus,
				enrollmentEndDate,

			});
		} else {
			res.status(200).json({ 
				videos: [],
				isEnrolled: false
			});
		}
	} catch (e) {
		res.status(400).json({
			error_code: "get_videos",
			message: e.message,
		}); 
	}
}