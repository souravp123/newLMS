import User from "database/models/user";

export default async (req, res) => {
	switch (req.method) {
		case "PUT":
			await userOTPConfirm(req, res);
			break;
		default:
			res.status(405).send(`Method ${req.method} not allowed`);
	}
};


const userOTPConfirm = async (req, res) => {
	let { otp, email } = req.body;
	try {
		if (!otp) {
			return res.status(422).json({
				message:
					"Invalid OTP",
			});
		}

		const user = await User.findOne({
			where: { email: email },
		});




		if (!user) {
			return res.status(422).json({ message: `Email is incorrect` });
		} else if (user.email_confirmed) {
			return res
				.status(422)
				.send({ message: `Email address is already confirmed!` });
		} else if (user.otp === otp) {
			await User.update(
				{
					email_confirmed: true,
					email_confirmed_at: Date.now(),
				},
				{
					where: {
						id: user.id,
					},
				}
			);

			res.status(201).json({
				message: `Email address confirmed successfully. Thank you`,
			});
		} else {
			return res.status(422).json({
				message:
					"Invalid OTP",
			});
		}
	} catch (error) {
		console.error("error==>>", error)
		res.status(400).json({
			error_code: "otp_confirmation",
			message: error.message,
		});
	}
};
