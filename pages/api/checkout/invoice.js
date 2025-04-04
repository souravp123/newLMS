import validate from "uuid-validate";
import User from "database/models/user";
import { invoiceEmail } from "email-templates/invoice-email";

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            await userInvoiceSend(req, res);  
            break;
        default: 
            res.status(405).json({
                message: `Method ${req.method} not allowed`,
            });
    }
}

const userInvoiceSend = async (req, res) => {
    const { email,amount, cartItems,invoiceDate } = req.body;

    try {
        if (!email) {
            return res.status(422).json({
                message: "Email should be a valid email address",
            });
        }

        const user = await User.findOne({ where: { email: email } });

        if (user) { 
            await invoiceEmail(user, amount, cartItems, invoiceDate);
            res.status(200).json({
                message: "Invoice sent successfully.",
            });
        } else {
            res.status(422).json({
                message: "Email does not exist! Please check again if the email is correct",
            });
        }
    } catch (e) {
        res.status(400).json({
            error_code: "send_invoice_email",
            message: e.message,
        });
    }
};
