import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import Router from "next/router";

const CourseCard = ({ course, onFav, onUnFav, userId, onAddCart ,currency, currencyRates,}) => {
	const cartItems = useSelector((state) => state.cart.cartItems);
	const router = useRouter();
	const { 
		id, 
		title,
		slug,
		short_desc, 
		latest_price,
		before_price,
		lessons,
		image: imageName,
		user,
		enrollments = [],
	} = course;
	const [fav, setfavs] = useState(false);
	const [add, setAdd] = useState(false);
	const [buy, setBuy] = useState(false);
	const [image, setImage] = useState('');
	const { edmy_users_token } = parseCookies();

	useEffect(() => {
		setAdd(cartItems.some((cart) => cart.id === id));
		if (userId && course && id) {
			const payload = {
				params: { userId: userId, courseId: id },
			};
			const url = `${baseUrl}/api/courses/course/exist`;
			axios.get(url, payload).then((result) => {
				if (result.data === "unauthorized") {
					cookie.remove("edmy_users_token");
					Router.push("/");
					return;
				}
				if (result && result.data.enroll === true)
					setBuy(result.data.enroll);
			});
		}

		const fetchImage = async () => {
			if (imageName) {
				const url = `${baseUrl}/api/get-image?imageName=${imageName}`;
				const requestOptions = {
					method: 'GET',
					headers: {
						Authorization: edmy_users_token,
					},
				};
				try {
					const response = await fetch(url, requestOptions);
					if (response.ok) {
						const imageBlob = await response.blob();
						const imageUrl = URL.createObjectURL(imageBlob);
						setImage(imageUrl);
					} else {
						console.error('Failed to fetch image:', response.statusText);
					}
				} catch (error) {
					console.error('Error fetching image:', error);
				}
			}
		};
		fetchImage();
	}, [course, cartItems]);






	useEffect(() => {
		if (userId) {
			const payload = {
				params: {
					userId: userId,
					courseId: id,
				},
			};

			const url = `${baseUrl}/api/favourites/new`;
			axios.get(url, payload).then((result) => {
				setfavs(result.data);
			});
		} else {
			setfavs(false);
		}
	}, [fav]);

	const handleSubscribe = () => {
        onAddCart(course);
        router.push("/checkout");
    };

	useEffect(() => {
		// console.log('Course ID:', id);
		// console.log('Is Favorite:', fav);
		// console.log('Is Added to Cart:', add);
		// console.log('Is Bought:', buy);
		// console.log('Course Details:', course);
	}, [fav, add, buy, course]);

	const getPriceInCurrency = (price) => {
		const rate = currencyRates[currency] || 1;
		return (price * rate).toFixed(2); 
	};

	const priceInCurrency = getPriceInCurrency(latest_price);

	// console.log("card currency", currency)
	// console.log("card currencyrate", currencyRates)

	

	return (
		<div className="col-lg-3 col-md-6">
			<div className="single-courses" >
				<div className="courses-main-img">
					<img
						src={image} alt="Image"
					/>
				</div>
				<div className="courses-content">
					<h3>{title}</h3>
					<ul className="admin">
						<li>
							<img
								src={
									user.profile_photo
										? user.profile_photo
										: "/images/admin-1.jpg"
								}
								className="rounded-circle"
								alt={user.first_name}
							/>
						</li>
						<li>
							<span>By</span>
						</li>
						<li>{`${user.first_name} ${user.last_name}`}</li>
					</ul>
					{/* <h4>
						{before_price > 0 && <del>${before_price}</del>} 
						USD {latest_price}
						
					</h4> */}
					<h4>
						{/* {before_price > 0 && <del>{getPriceInCurrency(before_price)} {currency}</del>}  */}
						{/* {getPriceInCurrency(latest_price)} {currency} */}
						{priceInCurrency} {currency}
					</h4>
				</div>

				<div className="courses-hover-content">
					<div className="sk">
						<div>
							<h3>
								<Link 
								 href={{
									pathname: `/course/${slug}`,
									query: {
										// priceInCurrency: priceInCurrency,
										currency: currency,
										// currencyRates: currencyRates
										currencyRates: JSON.stringify(currencyRates) 
									}
								}}
								>
									<a>{title}</a>
								</Link>
							</h3>
							<p>{short_desc.slice(0, 108)}</p>

							<div className="courses-btn d-flex justify-content-between align-items-center">
								{buy ? (
									<button
										className="default-btn"
										onClick={() =>
											router.push(
												`/learning/course/${slug}`
												// `/learning/my-courses/`
											)
										}
									>
										View My Course
									</button>
								) : (
									<button
                                        className="default-btn txt-white"
                                        onClick={handleSubscribe}
										course={course}
                                    >
                                        Subscribe
                                    </button>
								)}
								{fav ? (
									<motion.button
										whileTap={{ scale: 3 }}
										transition={{ duration: 0.5 }}
										className="default-btn wish"
										onClick={() => {
											onUnFav(id);
											setfavs(!fav);
										}}
									>
										<i className="ri-heart-fill" style={{ color: "red" }}></i>
										<i className="ri-heart-fill hover"></i>
									</motion.button>
								) : (
									<motion.button
										whileTap={{ scale: 3 }}
										transition={{ duration: 0.5 }}
										className="default-btn wish"
										onClick={() => {
											onFav(id);
											setfavs(!fav);
										}}
									>
										<i className="ri-heart-line" ></i>
										<i className="ri-heart-fill hover"></i>
									</motion.button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
