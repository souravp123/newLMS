import Razorpay from 'razorpay';
import { Enrolment, Instructor_Earning, Course } from "database/models";
import { calculateCartTotal } from "@/utils/calculateCartTotal";

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
    const { cartItems, userId, buyer_name, buyer_email, buyer_avatar, currency, amount } = req.body;
    const { stripeTotal } = calculateCartTotal(cartItems);
    try {
        let element = cartItems[0];
        const plan = await razorpay.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: element.title + " - Monthly",
                amount: Number(amount) * 100,
                currency: currency,
                description: element.short_desc
            }
        })
        const subscriptions = await razorpay.subscriptions.create({
            plan_id: plan.id,
            customer_notify: 1,
            quantity: 1,
            total_count: 12,
            notify_info: {
                notify_email: buyer_email
            }
        })

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 30);


        await Enrolment.create({
            bought_price: element.price,
            payment_method: "Card",
            buyer_name,
            buyer_email,
            buyer_avatar,
            userId,
            start_date: startDate,
            end_date: endDate,
            courseId: element.id,
            status: "unpaid",
            rz_pay_plan_id: plan.id,
            rz_pay_subscription_id: subscriptions.id,
            rz_pay_subscription_status: "created"
        });

        const courseInstructor = await Course.findOne({
            attributes: ["userId"],
            where: { id: element.id },
        });

        await Instructor_Earning.create({
            earnings: element.price,
            userId: courseInstructor.userId,
            courseId: element.id,
        });

        // });


        res.status(200).json({
            message: "Subscription Created successfully.",
            subscriptionId: subscriptions.id,
            planId: plan.id,
            paymentUrl: subscriptions.short_url,
            description: plan.item.description
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
            error_code: "create_enrolment",
            message: error.message,
        });
    }
};
