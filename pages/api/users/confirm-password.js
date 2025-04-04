import User from "database/models/user";
import bcrypt from "bcrypt";


export default async (req, res) => { 
	switch (req.method) {
		case "PUT":
			await userPasswordConfirm(req, res);
			break;
		default:
			res.status(405).send(`Method ${req.method} not allowed`);
	}
};


const userPasswordConfirm = async (req, res) => {
    let { currentPassword, reset_password_token, email, password } = req.body;
    try {
        
        if (!reset_password_token || !email || !currentPassword) {
            return res.status(422).json({
                message: "Invalid request. Please provide both email and reset password token.",
            });
        }
        

        const user = await User.findOne({
            where: { reset_password_token: reset_password_token },
        });

        if (!user) {
            return res.status(422).json({
                 message: ` email not found`
                 });
        }
        
		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(422).json({ message: "Current password is incorrect" });
		}


        if (user.reset_password_token !== reset_password_token) {
            return res.status(422).json({  
                message: `Invalid reset password token` 
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);


        await User.update({
            password: passwordHash, 
        },{
            where:{email: email}
        });

        res.status(201).json({
            message: `Password successfully changed.`,  
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error_code: "reset_password",
            message: "An error occurred while resetting the passwordsss.",
        });
    }
};

