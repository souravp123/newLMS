import jwt from "jsonwebtoken";
import { Course, User, Enrolment } from "database/models";
import { Sequelize } from "sequelize";
import { parse } from 'cookie';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
    key_id: process.env.RZ_PAY_KEY_ID,
    key_secret: process.env.RZ_PAY_SECRET_KEY,
});

export default async function handler(req, res) {
	if (!("authorization" in req.headers)) {
		return res.status(401).json({ message: "No autorization token" });
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
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const cookies = parse(req.headers.cookie || '');
		const sessionToken = cookies.session_token;
		const user = await User.findOne({ where: { session_token: sessionToken } });
		if (user === null) {
			return res.status(200).json("unauthorized");
		}
		const subscriptions = await fetchRazorpaySubscriptions();
		console.log("Fetched subscriptions================:", subscriptions);

		console.log("userId:", userId);


		
		const enrolments = await Enrolment.findAll({
			order: [["created_at", "DESC"]],
			include: [
				{
					model: Course,
					as: "course",
					attributes: ["id", "title", "slug", "image", "is_class"],
					include: [
						{
							model: User,
							as: "user",
							attributes: ["first_name", "last_name", "profile_photo"],
						},

					],
				},
			],
			where: { userId: userId },
			having: Sequelize.literal(
				"(end_date, userId, courseId) IN (SELECT MAX(end_date), userId, courseId FROM enrolments GROUP BY userId, courseId)"
			),
		});
		console.log("Fetched enrolments:==========>", enrolments);


		const subscriptionIds = subscriptions.map(sub => sub.id);
		console.log("Subscription IDs=======:", subscriptionIds);


		// const matchingEnrolments = enrolments.filter(enrolment =>
      	// 	subscriptionIds.includes(enrolment.rz_pay_subscription_id)
    	// );
		const matchingEnrolments = enrolments.filter(enrolment => {
		if (!enrolment.rz_pay_subscription_id) {
			console.log(`Enrolment ${enrolment.id} missing subscription ID`);
			return false;
		}
		return subscriptionIds.includes(enrolment.rz_pay_subscription_id);
});


		console.log("Matching Enrolments============:", matchingEnrolments);

 
		const currentStartDate = new Date();
		const currentEndDate = new Date();
		currentEndDate.setDate(currentEndDate.getDate() + 30); 

		for (const enrolment of matchingEnrolments) {
            const subscription = subscriptions.find(sub => sub.id === enrolment.rz_pay_subscription_id);
            const subscriptionStatus = subscription ? subscription.status : "created";
			const enrolmentStatus = subscriptionStatus === "active" ? "paid" : enrolment.status;

			const enrollmentEndDate = new Date(enrolment.end_date);
			if (subscriptionStatus !== enrolment.rz_pay_subscription_status || currentStartDate > enrollmentEndDate) {
				await Enrolment.update(
					{ 
						start_date: currentStartDate, 
						end_date: currentEndDate, 
						rz_pay_subscription_status: subscriptionStatus,
						status: enrolmentStatus 
					},
					{ where: { id: enrolment.id } }
				);
			}
        }
		console.log("Enrolment IDs======>:", enrolments.map(enrol => enrol.rz_pay_subscription_id));




		res.status(200).json({
			enrolments,
			matchingEnrolments,
			subscriptions,
		});
	} catch (e) {
		res.status(400).json({
			error_code: "enrolments",
			message: e.message,
		});
	}
};

// const fetchRazorpaySubscriptions = async (email) => {
//     try {
//         const subscriptions = await razorpay.subscriptions.all({
//             customer_notify: 1,
//             customer_details: {
//                 email: email,
//             }
//         });
//         return subscriptions.items;
//     } catch (error) {
//         console.error("Error fetching Razorpay subscriptions:", error);
//         return [];
//     }
// };
const fetchRazorpaySubscriptions = async () => {
	try {
	  const response = await razorpay.subscriptions.all();
	  return response.items;
	} catch (error) {
	  console.error('Error fetching Razorpay subscriptions:', error);
	  return [];
	}
};
