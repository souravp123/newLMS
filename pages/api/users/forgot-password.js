import validate from "uuid-validate";
import User from "database/models/user";
import { forgotPassword } from "email-templates/reset-password";

export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			await userForgotPasswordLinkSend(req, res);  
			break;
		default: 
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			});
	}
}
 
const userForgotPasswordLinkSend = async (req, res) => {
	let { reset_password_token,email } = req.body;
    const validUuid = validate(reset_password_token);

	



	try {
		if (!email) {
			return res.status(422).json({
				message: "Email should be a valid email address",
			});
		} else if(validUuid){
			return res.status(422).json({ message: "Token is incorrect" });
		}

		// Check if user with that email if already exists
		const user = await User.findOne({
			where: { email: email },
		});

		if (user) {
			forgotPassword(user);
		
            

			res.status(200).json({
				message: "Please check your email and Reset Password.",
			});
		} else {
			res.status(422).json({
				message:
					"Email does not exist! Plecase check again if the email is correct",
			});
		}
	} catch (e) {
		res.status(400).json({
			error_code: "confirm_email",
			message: e.message,
		});
	}
};
