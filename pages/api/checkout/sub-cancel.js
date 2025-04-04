import Razorpay from "razorpay";
import { Enrolment } from "@/database/models";
import jwt from "jsonwebtoken";

const razorpay = new Razorpay({
    key_id: process.env.RZ_PAY_KEY_ID,
    key_secret: process.env.RZ_PAY_SECRET_KEY,
});

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            await handlePostRequest(req, res);
            break;
        default:
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

const handlePostRequest = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ message: "Subscription ID is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const response = await razorpay.subscriptions.cancel(subscriptionId);

        await Enrolment.update(
            { status: 'cancelled' },
            { where: { rz_pay_subscription_id: subscriptionId, userId: userId } }
        );

        res.status(200).json({ success: true, message: "Subscription cancelled successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            error_code: "cancel_subscription",
            message: error.message,
        });
    }
};
