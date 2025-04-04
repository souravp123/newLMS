import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Router from "next/router";
import baseUrl from "@/utils/baseUrl";
import Button from "../../utils/Button";



const INITIAL_USER ={
	email:"",
}

const  ForgotPasswordForm = () => {
	const [user, setUser] = React.useState(INITIAL_USER);
	const [loading, setLoading] = React.useState(false); 
	const [disabled, setDisabled] = React.useState(true);



	React.useEffect(() => {
		const isUser = Object.values(user).every((el) => Boolean(el));
		isUser ? setDisabled(false) : setDisabled(true);
	}, [user]);


	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser((prevState) => ({ ...prevState, [name]: value }));

	};

	
	const handleSubmit = async (e) => {
		e.preventDefault(); 
		try {
			setLoading(true);
			const url = `${baseUrl}/api/users/forgot-password`;
			const payload = { ...user };
			const response = await axios.post(url, payload);
			toast.success(response.data.message, {
				style: {
					border: "1px solid #4BB543",
					padding: "16px",
					color: "#4BB543",
				},
				iconTheme: {
					primary: "#4BB543",
					secondary: "#FFFAEE",
				},
			});
			Router.push("/auth");
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message, {
				style: {
					border: "1px solid #ff0033",
					padding: "16px",
					color: "#ff0033",
				},
				iconTheme: {
					primary: "#ff0033",
					secondary: "#FFFAEE",
				},
			});
		} finally {
			setLoading(false);
		}
	};


	return (
		<>
			<div className="ptb-100">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-lg-4">
							<div className="login-form">
								<h3 style={{textAlign:"center"}}>Please enter Email address.</h3>
								<p>We will send the password reset instructions to the email address for this account.</p>

								<form onSubmit={handleSubmit}>
									<div className="form-group">
										{/* <label>Email</label> */}
										<input
											type="text"
											className="form-control"
											name="email"
											placeholder="Email"
											value={user.email}
											onChange={handleChange}
										/>
									</div>

									<button 
										className="default-btn alert-success"
									 	type="submit"
										loading={loading}
									 >
										Send Link
									 </button>

								
								</form>
							</div>
						</div>
					</div>
				</div>   
			</div>
		
		</>
	);
};
{/* <div class="text" style="padding: 0 2.5em; text-align: left;">
<h4>Dear ${user.first_name},</h4>
<p>Thanks for registering on the Ivy Dude! Please click the below link to verify your email address and activate your account.</p>
<p><a href="${baseUrl}/confirm-email?token=${user.reset_password_token}&email=${user.email}" style="text-decoration: underline;">Confirm My Email Address</a></p>
</div>  */}

export default ForgotPasswordForm;