import jwt from "jsonwebtoken";
import { slugify } from "@/utils/auth";
import Course from "database/models/course";

// const stripeSecret = Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
	if (!("authorization" in req.headers)) {
		return res.status(401).json({ message: "No autorization token" });
	}
	switch (req.method) {
		case "POST":
			await handlePostRequest(req, res);
			break;
		case "DELETE":
			await handleDeleteRequest(req, res);
			break;
		default:
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			}); 
	}
}

const handlePostRequest = async (req, res) => {
	const {
		title,
		short_desc,
		testimonial,
		overview,
		latest_price,
		before_price,
		lessons,
		duration,
		image,
		access_time,
		requirements,
		what_you_will_learn,
		who_is_this_course_for,
		catId,
		is_class,
	} = req.body;
	try {
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);

		let slug = slugify(title);
		const slugExist = await Course.findOne({
			where: { slug: slug },
		});

		if (slugExist) {
			slug = `${slug}-${Math.floor(
				Math.random() * (999 - 100 + 1) + 100
			)}`;
		}

		// const product = await stripeSecret.products.create({
		// 	name: title,
		// 	active: true,
		// 	default_price_data: {
		// 		currency: 'usd',
		// 		unit_amount: latest_price,
		// 		recurring: {
		// 			interval: 'month',
		// 		}
		// 	}
		// });

		// Save product.id,product.default_price into product table as strip_product_id,strip_price_id
		const newcourse = await Course.create({
			title,
			slug,
			short_desc,
			testimonial,
			overview,
			latest_price,
			before_price,
			lessons,
			duration,
			image,
			access_time,
			requirements,
			what_you_will_learn,
			who_is_this_course_for,
			userId,
			catId,
			is_class: is_class && true
		});

		res.status(200).json({
			message:
				"Course created successfully. Please wait until approved by an admin.",
			course: newcourse,
		});
	} catch (e) {
		console.log("===>>", e)
		res.status(400).json({
			error_code: "create_course",
			message: e.message,
		});
	}
};
