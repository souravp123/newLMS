import React, { useState } from "react";
import Link from "next/link";
import { handleLogout } from "@/utils/auth";
import { motion } from "framer-motion";
import { FaYoutube, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";


const TopHeader = ({ user }) => { 
	return (
		<motion.div
			className="top-header-area "
			initial={{ y: -25 }}
			animate={{ y: 0 }}
			transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
		>
			<div className="container-fluid">
				<div className="row align-items-center">
					<div className="col-lg-8">
						<div className="header-left-content">

							<Link href="https://www.instagram.com/aaakash_ivydude">
								<a className="navbar-brand">
									<RiInstagramFill
										style={{
											color: "white",
											fontSize: "1.5rem",
										}} />
								</a>
							</Link>
							<RxDividerVertical />
							<Link href="https://www.youtube.com/@IvyDude/xregexp">
								<a className="navbar-brand">
									<FaYoutube
										style={{
											color: "white",
											fontSize: "1.5rem",
										}} />
								</a>
							</Link>
							<RxDividerVertical />
							<Link href="https://www.linkedin.com/in/akash-neel-bhowmick-36b7b72b6">
								<a className="navbar-brand">
									<FaLinkedin
										style={{
											color: "white",
											fontSize: "1.5rem",
										}} />
								</a>
							</Link>
							<RxDividerVertical style={{ fontSize: "2rem" }} />
							<Link href="tel:+91-831-015-2022">
								<a

									className="navbar-brand"
								>
									<FaPhoneAlt
										style={{
											color: "white",
											fontSize: "1.2rem",
											marginLeft: "1rem"
										}} />
									{/* <span>+91-8310152022</span> */}
								</a>

							</Link>

						</div>
					</div>

					<div className="col-lg-4">
						<ul className="header-right-content">
							{/* <li>
								<Link href="/become-an-instructor">
									<a>Become An Instructor</a>
								</Link>
							</li> */}
							<li className="auth-link">
								{user ? (
									<Link href="#">
										<a
											onClick={(e) => {
												e.preventDefault();
												handleLogout();
											}}
										>
											<i className="bx bx-log-out"></i>{" "}
											Sign out
										</a>
									</Link>
								) : (
									<Link href="/auth?action=login">
										<a>
											<i className="ri-arrow-right-line"></i>{" "}
											Sign in
										</a>
									</Link>
								)}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default TopHeader;
