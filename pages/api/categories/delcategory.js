import { Category,User,Course,Enrolment } from "database/models";

export default async function handler(req, res) {
	if (!("authorization" in req.headers)) {
		return res.status(401).json({ message: "No autorization token" });
	}
	switch (req.method) {
		case "GET":
			await handleGet(req, res);
			break;
		case "DELETE":
			await handleDelete(req, res);
			break;
		default:
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			});
	}
}

const handleGet = async (req, res) => {
	try {
		const categories = await Category.findAll({
			order: [["created_at", "DESC"]],
			limit: 20,
			include: [
                {
                    model: Course,
                    as: 'courses', 
                    include: [
                        { 
                            model: User,
                            as: 'user', 
                            attributes: ["first_name", "last_name", "profile_photo"],
                        },
                        {
                            model: Enrolment,
                            as: 'enrolments', 
                            attributes: ["id","userId","courseId"],
                        }
                    ]
                }
            ],			
		});
		
		res.status(200).json({ categories });
	} catch (e) {
		res.status(400).json({
			error_code: "get_categories",
			message: e.message,
		});
	}
};

const handleDelete = async (req, res) => {
    const { catId } = req.query;

    try {
        const courses = await Course.findAll({
            where: { id: catId }
        });

        for (const course of courses) {
            const enrollments = await Enrolment.findOne({
                where: { courseId: course.id }
            });
			
        }

        const cat = await Category.findOne({
            where: { id: catId }
        });

        await cat.destroy();

        res.status(200).json({ message: "Category deleted successfully." });
    } catch (e) {
        res.status(400).json({
            error_code: "delete_category",
            message: e.message,
        });
    }
};
