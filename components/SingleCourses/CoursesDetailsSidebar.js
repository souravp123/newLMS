import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import BuyCourseBtn from "./BuyCourseBtn";
import { calculateDiscount } from "@/utils/helper";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import Router from "next/router";

const CoursesDetailsSidebar = ({ current_user, course, isCurrentUserInstructor,currency, currencyRates={} }) => {
	const cartItems = useSelector((state) => state.cart.cartItems);
	const dispatch = useDispatch();
	const [add, setAdd] = useState(false);
	const [alreadyBuy, setAlreadyBuy] = useState(false);
	const router = useRouter();
	const [apply, setApplyCoupon] = useState(false);
	const [coupon, setCoupon] = useState({ coupon: "" });
	const discount = useSelector((state) => state.cart.discount);
	const [image, setImage] = useState('');
	const { edmy_users_token } = parseCookies();
	// const [selectedCurrency, setSelectedCurrency] = useState('USD');

	// const handleCurrencyChange = (currency) => {
    //     setSelectedCurrency(currency);
    // };

	const [isCourseExpired, setIsCourseExpired] = useState(true);
	

	

	useEffect(() => {
		const fetchImage = async () => {
			if (course.image) {
				const url = `${baseUrl}/api/get-image?imageName=${course.image}`;
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
	}, [course]);



	useEffect(() => {
		const courseExist = cartItems.find((cart) => {
			return course.id === cart.id;
		});
		courseExist && setAdd(true);
		if (current_user && course && course.id) {
			const payload = {
				params: { userId: current_user.id, courseId: course.id },
			};
			const url = `${baseUrl}/api/courses/course/exist`;
			axios.get(url, payload).then((result) => {
				if (result.data === "unauthorized") {
					cookie.remove("edmy_users_token");
					Router.push("/");
					return;
				}
				if (result && result.data.enroll === true)
					setAlreadyBuy(result.data.enroll);
			});
		}
	}, [cartItems, course]);

	const addToCart = (courseCart) => {
		let courseObj = {};
		courseObj["id"] = courseCart.id;
		courseObj["title"] = courseCart.title;
		courseObj["slug"] = courseCart.slug;
		courseObj["price"] = discount > 0 ? discount : courseCart.latest_price;
		courseObj["regular_price"] = courseCart.before_price;
		courseObj["image"] = courseCart.image;
		courseObj["lessons"] = courseCart.lessons;
		courseObj["duration"] = courseCart.duration;
		courseObj["access_time"] = courseCart.access_time;
		courseObj["quantity"] = 1;
		courseObj[
			"instructor"
		] = `${courseCart.user.first_name} ${courseCart.user.last_name}`;
		dispatch({
			type: "ADD_TO_CART",
			data: courseObj,
		});
		router.push("/checkout");
	};

	const handleCoupon = async (e) => {
		e.preventDefault();
		try {
			const payload = { coupon: coupon };

			const response = await axios.post(
				`${baseUrl}/api/coupons/get-coupon`,
				payload
			);
			dispatch({
				type: "GET_DISCOUNT",
				data: calculateDiscount(
					response.data.discount.discount,
					course.latest_price
				),
			});

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
		}
	};
	

	const getPriceInCurrency = (price) => {
        const rate = currencyRates[currency] || 1;
        return (price * rate).toFixed(2); 
    };

    const priceInCurrency = getPriceInCurrency(course.latest_price);
	console.log(priceInCurrency)
	console.log("side.currency",currency)
	console.log("side.rate",currencyRates)



	return (
		<div className="col-lg-4">
			<div className="course-details-sidebar">
				<div className="course-preview">
					<img src={image} alt={course.title}
						style={{ width: "50%", height: "auto" }}
					/>
				</div>

				<div className="sidebar-futcher">
					<div className="sidebar-title d-flex justify-content-between">
						<h2>
							 {/* {course.latest_price} USD */}
							{/* {currencyRates}  */}
							 {priceInCurrency} {currency}
							{/* {discount > 0 ? discount : course.latest_price}{" "} */}
							{/* {course.before_price > 0 && (
								<del>${course.before_price}</del>
							)} */}
						</h2>
						{/* {course.before_price > 0 && <p>Offer for today</p>} */}
					</div>

					<ul>
						<li>
							{/* <div className="d-flex justify-content-between align-items-center">
								<span>
									<i className="ri-tv-line"></i> Live Class
								</span>
								{course.is_class ? (
									<div className="live-class-icon"></div>
								) : (
									"No"
								)}
							</div> */}
						</li>
						<li>
							<i className="ri-bar-chart-fill"></i>
							Category
							<span>
								{course.category && course.category.name}
							</span>
						</li>
						<li>
							<i className="ri-time-line"></i>
							Duration
							<span>{course.duration}</span>
						</li>
						<li>
							<i className="ri-booklet-line"></i>
							Lectures
							<span>{course.lessons}</span>
						</li>
						<li>
							<i className="ri-store-line"></i>
							Resources
							<span>
								{course.assets && course.assets.length}{" "}
								downloadable
							</span>
						</li>
						{/* <li>
							<i className="ri-group-line"></i>
							Enrolled
							<span>
								{course.enrolments && course.enrolments.length}{" "}
								Students
							</span>
						</li> */}


						<li>
							<i className="ri-key-2-fill"></i>
							Access
							<span>{course.access_time}</span>
						</li>
					</ul>

					{!isCurrentUserInstructor && apply && (
						<div className="coupon">
							<h4 onClick={() => setApplyCoupon(!apply)}>
								Apply Coupon
							</h4>

							<form onSubmit={handleCoupon}>
								<input
									type="text"
									className="input-search"
									placeholder="Enter Coupon"
									name="search"
									value={coupon.coupon}
									onChange={(e) => setCoupon(e.target.value)}
								/>
								<button type="submit">
									<b>Apply</b>
								</button>
							</form>
						</div>
					)}

					<div className="cart-wish d-flex justify-content-between">
						{alreadyBuy ? (
							<button
								onClick={() =>
									router.push("/learning/my-courses")
								}
								className="default-btn" 
							>
								View My Courses
							</button>
						) : (
							<>
								{/* {add && !isCurrentUserInstructor && (
									<button
										onClick={() => router.push("/checkout")}
										className="default-btn"
									>
										View Cart
									</button>
								)} */}
								{!add && !isCurrentUserInstructor && (
									<button
										onClick={() => addToCart(course)}
										className="default-btn"
									>
										Subscribe Now
									</button>
								)}
							</>
						)}
					</div>

					{alreadyBuy && !add && !isCurrentUserInstructor && isCourseExpired && (
						<BuyCourseBtn
							// isCourseExpired ={isCourseExpired}
							current_user={current_user}
							course={course}
						/>

					)}
					{/* {isCourseExpired && alreadyBuy ? (
							<button
								onClick={() => buyCourse(course)}
								className="default-btn buy"
							> 
								Renew Subscription Now
							</button>
						):(			 
							null
						)} */}

				</div>
			</div>
		</div>
	);
};

export default CoursesDetailsSidebar;
