import { Course, User, Category, Video, Enrolment } from "database/models";

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
    const { courseTitle } = req.query;
    try {
        const courses = await Course.findAll({
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["first_name", "last_name", "profile_photo"],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["name", "slug"],
                },
                {
                    model: Enrolment,
                    as: "enrolments",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "first_name", "last_name", "email", "phone", "studentLevel"],
                        },
                    ],
                },
            ],
            where: {
                approved: true,
                ...(courseTitle && { title: courseTitle })
            },
        });


        const students = courses.reduce((acc, course) => {
            return acc.concat(course.enrolments.map(enrolment => enrolment.user));
        }, []);


        res.status(200).json({ students: students || [] });
    } catch (e) {
        res.status(400).json({
            error_code: "get_courses",
            message: e.message,
        });
    }
};
