import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
	// Yes. SMTP!
	service: "SMTP",
	host: "smtp.zoho.in",
	secureConnection: true, // use SSL
	port: 465, // port for secure SMTP
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	}, 
});
