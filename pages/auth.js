import React, { useEffect, useState } from "react";
import PageBanner from "@/components/Common/PageBanner";
import Footer from "@/components/_App/Footer";
import Navbar from "@/components/_App/Navbar";
import LoginForm from "@/components/Authentication/LoginForm";
import RegisterForm from "@/components/Authentication/RegisterForm";
import { motion } from "framer-motion";
import ConfirmOTP from "@/components/Authentication/ConfirmOTP";
import { useRouter } from 'next/router';

const Auth = () => {
	const [register, setRegister] = useState("register");
	const [userEmail, setUserEmail] = useState('');
	const [isOn, setIsOn] = useState(false);
	const [showConfirmOTP, setShowConfirmOTP] = useState(false);
	const [otpConfirmed, setOtpConfirmed] = useState(false);
	const toggleSwitch = () => setIsOn(!isOn);
	const router = useRouter();
	const { action } = router.query;

	useEffect(() => {
		if (action) {
			setRegister(action)
		}
	}, [action])

	const handleRegisterSuccess = (email) => {
		setUserEmail(email);
		setShowConfirmOTP(true);
	};

	const handleOTPConfirmSuccess = () => {
		setOtpConfirmed(true);
		setShowConfirmOTP(false);
		router.push("/auth?action=login");
	};


	const handleNavigation = (e) => {
		if (!otpConfirmed) {
			e.stopPropagation();
		}
	};





	return (
		<>
			<Navbar />
			<PageBanner
				pageTitle={register.charAt(0).toUpperCase() + register.slice(1)}
				homePageUrl="/"
				homePageText="Home"
				activePageText="Begin your journey to success now"
			/>
			<div className="register-area pt-50 pb-70">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<div className="register-img">
								<img
									src="/images/register-img-1.png"
									alt="Image"
								/>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="register-form">
								{register == "register" ? (
									<motion.h2
										initial={{ scale: 0 }}
										animate={{ scale: 1, x: 0 }}
										exit={{ scale: 0 }}
									>
										Create your account
									</motion.h2>
								) : (
									<motion.h2
										initial={{ scale: 0 }}
										animate={{ scale: 0.9, x: 0 }}
										exit={{ scale: 1 }}
									>
										Sign in
									</motion.h2>
								)}

								<ul
									className="register-tab nav nav-tabs justify-content-between"
									data-ison={isOn}
									onClick={toggleSwitch}
								>
									<li
										className="nav-item"
										role="presentation"
									>
										<motion.button
											className={`nav-link ${register == "register"
												? "active"
												: ""
												}`}
											onClick={() =>
												setRegister("register")
											}
											whileHover={{
												scale: 1.3,
												transition: { duration: 1 },
											}}
											whileTap={{ scale: 0.8 }}
											layout
											transition={{
												type: "spring",
											}}
										>
											Register
										</motion.button>
									</li>
									<li
										className="nav-item"
										role="presentation"
										id="login"
									>
										<motion.button
											className={`nav-link ${register == "login"
												? "active"
												: ""
												}`}
											type="button"
											onClick={() => setRegister("login")}
											whileHover={{
												scale: 1.3,
												transition: { duration: 1 },
											}}
											whileTap={{ scale: 0.8 }}
											transition={{
												type: "spring",
											}}
										>
											Login
										</motion.button>
									</li>
								</ul>
								<div className="tab-content">
									{ }
									{register === "register" && !showConfirmOTP ? (
										<RegisterForm onRegisterSuccess={handleRegisterSuccess} />
									) : register === "login" && !showConfirmOTP ? (
										<LoginForm onRegisterSuccess={handleRegisterSuccess} />
									) : (
										<ConfirmOTP email={userEmail} onOTPConfirmSuccess={handleOTPConfirmSuccess} />
									)}
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

export default Auth;
