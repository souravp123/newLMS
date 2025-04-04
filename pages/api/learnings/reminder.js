import jwt from "jsonwebtoken";
import { Enrolment, Course, User } from "@/database/models";
import { reminderEmail } from "email-templates/course-renewal";

export default async function handler(req, res) {
   
    switch (req.method) {
        case "POST": 
            await userReminderSend(req, res); 
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

const userReminderSend = async (req, res) => {
    const { email, courseTitle, renewalDate } = req.body;

    try {
        if (!email) {
            return res.status(422).json({
                message: "Email should be a valid email address",
            });
        }

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            await reminderEmail(user, courseTitle, renewalDate);
            res.status(200).json({
                message: "Reminder sent successfully.",
            });
        } else {
            res.status(422).json({
                message: "Email does not exist! Please check again if the email is correct",
            });
        }
    } catch (e) {
        res.status(400).json({
            error_code: "send_reminder_email",
            message: e.message,
        });
    }
};
