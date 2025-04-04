import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import Link from "next/link";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import Button from "@/utils/Button";
import { handleLogout } from "@/utils/auth";

const BasicInformation = ({ user }) => {
	const { edmy_users_token } = parseCookies();
	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = React.useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserUpdate((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

		if (!password || !passwordRegex.test(password)) {
			toast.error("Password must be at least 8 characters long, include a number and a special character", {
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
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			setLoading(true);
			const url = `${baseUrl}/api/users/confirm-password`;
			const data = { currentPassword, password, reset_password_token: user.reset_password_token, email: user.email };
			const payload = {
				headers: { Authorization: edmy_users_token },
			};
			const response = await axios.put(url, data, payload);

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
			preventDefault();
			handleLogout();

			setTimeout(() => {
				window.location.reload();
			}, 1000);
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
			<Navbar user={user} />

			<div className="ptb-100">
				<div className="container">
					<h2 className="fw-bold mb-4">Profile & Settings</h2>

					<ul className="nav-style1">
						<li>
							<Link href="/profile/basic-information">
								<a>Profile</a>
							</Link>
						</li>
						<li>
							<Link href="/profile/photo">
								<a>Profile Picture</a>
							</Link>
						</li>
						<li>
							<Link href="/profile/forgotpassword">
								<a className="active">Password Reset</a>
							</Link>
						</li>
					</ul>

					<div className="ptb-50">
						<div className="container">
							<div className="row justify-content-center">
								<div className="col-lg-4">
									<div className="login-form">
										<h3 style={{ textAlign: "center", marginBottom: "40px" }}>Create New Password</h3>

										<form onSubmit={handleSubmit}>
											<div className="form-group">
												<input
													name='currentpassword'
													type="password"
													className="form-control"
													placeholder="Current Password"
													value={currentPassword}
													onChange={(evt) => { setCurrentPassword(evt.target.value) }}
												/>
											</div>
											<div className="form-group">
												<input
													name='password'
													type="password"
													className="form-control"
													placeholder="New Password"
													value={password}
													onChange={(evt) => { setPassword(evt.target.value) }}
												/>
											</div>
											<div className="form-group">
												<input
													name='confirmpassword'
													type="password"
													className="form-control"
													placeholder="Confirm Password"
													value={confirmPassword}
													onChange={(evt) => { setConfirmPassword(evt.target.value) }}
												/>
											</div>

											<button
												className="default-btn"
												type="submit"
												loading={loading}

											>
												{/* Reset Password */}
												{loading ? "Resetting..." : "Reset Password"}
											</button>

										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default BasicInformation;
