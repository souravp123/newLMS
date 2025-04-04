import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri"

const Footer = ({user}) => {
	const currentYear = new Date().getFullYear();

	


	const coursePath = user && user.role === "instructor" ? "/instructor/courses" : "/learning/my-courses";

	return (
		<>
			<div className="footer-area bg-color-f6fafb pt-100 pb-50">
				<div className="container">
					<div className="row">
						<div className="col-lg-4 col-sm-6">
							<div className="single-footer-widget">
								<a href="index.html" className="logo">
									<img
										src="/images/demo.png"
										className="main-logo"
										alt="logo"
									/>
									<img
										src="/images/white-logo.png"
										className="white-logo"
										alt="logo"
									/>
								</a>
								<p>
									lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
									lorem ipsum lorem ipsum lorem ipsumlorem ipsumlorem ipsum lorem ipsum lorem ipsum 

								</p>
							</div>
						</div>

						<div className="col-lg-4 col-sm-6">
							<div className="single-footer-widget pl-40">
								<h3>Quick Link</h3>

								<ul className="import-link">
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href={coursePath}>
											<a>Courses</a>
										</Link>
									</motion.li>
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/about-us">
											<a>About Us</a>
										</Link>
									</motion.li> 
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/refund-policy">
											<a>Refund Policy</a>
										</Link>
									</motion.li>
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/privacy-policy">
											<a>Privacy Policy</a>
										</Link>
									</motion.li>
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/terms-conditions">
											<a>Terms & Conditions</a>
										</Link>
									</motion.li>
								</ul>
							</div>
						</div>

						{/* <div className="col-lg-3 col-sm-6">
							<div className="single-footer-widget pl-40">
								<h3>Help Center</h3>

								<ul className="import-link">
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/contact-us">
											<a>Support</a>
										</Link>
									</motion.li>
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/faq">
											<a>Get Help</a>
										</Link>
									</motion.li>
									<motion.li
										whileHover={{
											scale: 1.1,
											originX: 0,
											transition: { duration: 0.5 },
										}}
									>
										<Link href="/privacy-policy">
											<a>Privacy Policy</a>
										</Link>
									</motion.li>
								</ul>
							</div>
						</div> */}

						<div className="col-lg-4 col-sm-6">
							<div className="single-footer-widget">
								<h3>Contact Info</h3>

								<ul className="info">
									<li>
										<span>Call Us:</span>{" "}
										<a href="tel:">
											
										</a>
									</li>
									<li>
										<span></span>
											yekasolutions.com,<br/>
											yekasoultion.com, <br/>
											yekasoultion.com, India
										
									</li>
									{/* <li>
										<span>Address:</span>
									</li> */}
									{/* <li>
										<span>Mail Us:</span>{" "}
										<a href="mailto:dev@yekasolutions.com">
											dev@yekasolutions.com
										</a>
									</li> */}

									<div className="d-flex ">
										<li className="me-3">
											<span>
												<RiInstagramFill style={{ fontSize: "2rem" }} />
											</span>{" "}
											<a href="">
												Instagram
											</a>
										</li>

										<li className="me-3">
											<span>
												<FaYoutube style={{ fontSize: "2rem" }} />
											</span>{" "}
											<a href="">
												Youtube
											</a>
										</li>
										<li className="me-3">
											<span>
												<FaLinkedin style={{ fontSize: "2rem" }} />
											</span>{" "}
											<a href="">
												Linkedin
											</a>
										</li>
									</div>

								</ul>
							</div>
						</div>
					</div>
				</div>

				<img
					src="/images/footer-shape-1.png"
					className="shape shape-1"
					alt="footer"
				/>
				<img
					src="/images/footer-shape-2.png"
					className="shape shape-2"
					alt="footer"
				/>
			</div>

			<div className="copy-right-area bg-color-f6fafb ">
				<div className="container">
					<p>
						&copy; yeka {currentYear} is Proudly Owned by{" "}
						<a href="https:/" target="_blank">
							yekasolutions.com
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default Footer;
