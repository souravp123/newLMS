import React from "react";
import { useState, useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import Link from "@/utils/ActiveLink";
import ProfileDropdown from "./ProfileDropdown";
import Cart from "./Cart";
import CurrencyDropdown from "./CurrencyDropdown";

import SearchForm from "./SearchForm";
import TopHeader from "./TopHeader";
import { motion } from "framer-motion";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { parseCookies } from "nookies";




Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Navbar = ({ user, onCurrencyChange }) => {
	const initialCurrency = typeof window !== 'undefined' ? localStorage.getItem("selectedCurrency") || 'INR' : 'INR';

	const [menu, setMenu] = React.useState(true);
	const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
	const [country, setCountry] = useState(null);
	const { edmy_users_token } = parseCookies();




	const toggleNavbar = () => {
		setMenu(!menu);
	};

	React.useEffect(() => {
		let elementId = document.getElementById("navbar");
		document.addEventListener("scroll", () => {
			if (window.scrollY > 170) {
				elementId.classList.add("is-sticky");
			} else {
				elementId.classList.remove("is-sticky");
			}
		});

	const storedCurrency = localStorage.getItem("selectedCurrency");
		if (storedCurrency) {
			setSelectedCurrency(storedCurrency);
			console.log(`to localStorage: ${storedCurrency}`);


		} else {
			console.log('No currency in localstorage');
		}

		// console.log("Token:", edmy_users_token);


		fetch(`https://ipinfo.io/json`)
			.then(response => response.json())
			.then(data => {
				setCountry(data.country);
				console.log(`User's country: ${data.country}`);
				if (data.country === "IN") {
					localStorage.setItem("selectedCurrency", "INR");
					setSelectedCurrency("INR");
				} else {
					localStorage.setItem("selectedCurrency", "USD");
					setSelectedCurrency("USD");
				}
			})
			.catch(error => console.error('Error fetching location:', error));

	}, []);



	useEffect(() => {
		localStorage.setItem("selectedCurrency", selectedCurrency);
		console.log(`Currency saved to localStorage: ${selectedCurrency}`);
		if (onCurrencyChange) {
			onCurrencyChange(selectedCurrency);
		}
	}, [selectedCurrency, onCurrencyChange]);



	const classOne = menu
		? "collapse navbar-collapse nav-aling"
		: "collapse navbar-collapse show nav-aling";
	const classTwo = menu
		? "navbar-toggler navbar-toggler-right collapsed"
		: "navbar-toggler navbar-toggler-right";


	const coursePath = user && user.role === "instructor" ? "/instructor/courses" : "/learning/my-courses";

	// const handleCurrencyChange = (currency) => {
	//     setSelectedCurrency(currency);
	// };


	return (
		<>
			<TopHeader user={user} />
			<div id="navbar" className="navbar-area">
				<div className="desktop-nav">
					<div className="container-fluid ">
						<div className="navbar navbar-expand-lg navbar-light">
							<Link href="/">
								<a
									onClick={toggleNavbar}
									className="navbar-brand"
								>
									<img src="/images/demo.png" alt="logo" className="responsive-logo"  style={{width:"140px", height:"auto"}}/>
								</a>
							</Link>
							<button
								onClick={toggleNavbar}
								className={classTwo}
								type="button"
							>
								<span className="icon-bar top-bar"></span>
								<span className="icon-bar middle-bar"></span>
								<span className="icon-bar bottom-bar"></span>
							</button>

							<div
								className={classOne}
								id="navbarSupportedContent"
							>
								{/* <div className="others-options pe-0">
									<SearchForm
										formClass="search-form style1"
										btnClass="src-btn"
									/>
								</div> */}


								<ul className="navbar-nav ms-auto " >
									<motion.li
										className="nav-item" 
										whileHover={{
											scale: 1.1,
											transition: { duration: 0.5 },
										}}
										whileTap={{ scale: 0.9 }}
									>
										<Link href="/" activeClassName="active ">
											<a
												onClick={toggleNavbar}
												className="nav-link"
												// style={{paddingLeft:"60vh"}}
											>
												Home
											</a>
										</Link>
									</motion.li>
									{!user || user.role === "admin" ? <></> : <motion.li
										className="nav-item"
										whileHover={{
											scale: 1.1,
											transition: { duration: 0.5 },
										}}
										whileTap={{ scale: 0.9 }}
									>
										<Link
											href={coursePath}
											activeClassName="active"
										>
											<a
												onClick={toggleNavbar}
												className="nav-link"
												// style={{paddingLeft:"80vh"}}
											>
												My Courses
											</a>
										</Link>

										

									</motion.li>}
									{/* {(user === null || user === undefined || (user && user.role !== "admin" && user.role !== "instructor")) && (
										<motion.li className="nav-item">
											<CurrencyDropdown
													selectedCurrency={selectedCurrency}
													onCurrencyChange={setSelectedCurrency}
											/>
										</motion.li>
									)} */}

								</ul>
								
							</div>


							<div className="others-options">
								<ul className="d-flex align-items-center">
									{/* {!user && <Cart /> || user.role ==="student" && <Cart />} */}

									{user ? (
										<li className="profile_li">
											<ProfileDropdown {...user} />
										</li>

									) : (
										<motion.li whileTap={{ scale: 0.9 }}>
											<Link href="/auth?action=register">
												<a className="default-btn">
													<i className="ri-registered-line"></i>
													<span>Register Now</span>
												</a>
											</Link>
										</motion.li>
									)}
								</ul>
							</div>

						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
