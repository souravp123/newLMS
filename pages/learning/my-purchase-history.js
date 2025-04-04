import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import PageBanner from "@/components/Common/PageBanner";
import Footer from "@/components/_App/Footer";
import Link from "next/link";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import { formatDate } from "@/utils/helper";



function MyPurchases({ user }) {

	const { edmy_users_token } = parseCookies();

	const [enrolments, setEnrolments] = useState([]);
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [currencyRates, setCurrencyRates] = useState({});


	const handleCurrencyChange = (currency) => { 
        setSelectedCurrency(currency);
    };


	useEffect(() => {
        const fetchCurrencyRates = async () => {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                setCurrencyRates(data.rates);
            } catch (error) {
                console.error('Error fetching currency rates:', error);
            }
        };

        fetchCurrencyRates();
    }, []);

	const getPriceInCurrency = (price) => {
        const rate = currencyRates[selectedCurrency] || 1;
        return (price * rate).toFixed(2); 
    };
    const priceInCurrency = getPriceInCurrency();

	console.log("PURCH currency", selectedCurrency)
	console.log("PURCH currencyrate", getPriceInCurrency)


	useEffect(() => {
		const fetchEnrol = async () => {
			try {
				const payload = { headers: { Authorization: edmy_users_token } };
				const url = `${baseUrl}/api/learnings/my-purchases`;
				const response = await axios.get(url, payload);
				if (response.data.enrolments.length) {
					await response.data.enrolments.forEach(async (e, i) => {
						response.data.enrolments[i].course.imageUrl = await fetchImage(e.course.image, i);
						if (i === response.data.enrolments.length - 1)
							setEnrolments(response.data.enrolments);
					})
				}
			} catch (error) {
				console.error("Error fetching enrolments:", error);
			}
		};
		fetchEnrol();
	}, []);

	const fetchImage = async (image) => {
		if (image) {
			const url = `${baseUrl}/api/get-image?imageName=${image}`;
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
					return imageUrl;
				} else {
					console.error('Failed to fetch images:', response);
					return ""
				}
			} catch (error) {
				console.error('Error fetching image:', error);
				return "";
			}
		} 
	};

	// const getPriceInCurrency = (price) => {
    //     const rate = currencyRates[currency] || 1;
    //     return (price * rate).toFixed(2); 
    // };

    // const priceInCurrency = getPriceInCurrency(bought_price);




	return (
		<>
			<Navbar user={user}   onCurrencyChange={handleCurrencyChange}/>

			<PageBanner
				pageTitle="My Purchases"
				homePageUrl="/"
				homePageText="Home"
				activePageText="My Purchases"
			/>

			<div className="checkout-area ptb-100">
				<div className="container">
					<div className="row justify-content-center">
						{enrolments.length > 0
							? enrolments.map((enrol, index) => (
								<div
									className="col-lg-9 col-md-12"
									key={enrol.id}
								>
									<div className="shopping-cart">
										<div className="shopping-cart-list">
											<div className="row align-items-center">
												<div className="col-lg-3">
													<Link
														href={`/learning/course/${enrol.course.slug}`}
													>
														<a className="d-block image">
															<img
																src={enrol
																	.course
																	.imageUrl
																}

																alt="image"
															/>

														</a>
													</Link>
												</div>

												<div className="col-lg-5">
													<div className="content">
														<h3>
															<Link
																href={`/learning/course/${enrol.course.slug}`}
															>
																<a>
																	{
																		enrol
																			.course
																			.title
																	}
																</a>
															</Link>
														</h3>

														<p className="fs-14 mb-2">
															By{" "}
															{
																enrol.course
																	.user
																	.first_name
															}{" "}
															{
																enrol.course
																	.user
																	.last_name
															}
														</p>

														<ul className="list">
															<li>
																{
																	enrol
																		.course
																		.duration
																}
															</li>
															<li>
																{
																	enrol
																		.course
																		.lessons
																}
															</li>
															<li>
																{
																	enrol
																		.course
																		.access_time
																}
															</li>
														</ul>
													</div>
												</div>

												<div className="col-lg-4 col-6">
													<div className="price text-end">
														<span className="fw-bolder fs-16">
															{selectedCurrency} &nbsp;
															{getPriceInCurrency(enrol.bought_price)}
															
														</span>{" "}
														<span className="fw-bolder fs-16 d-inline-block ms-4">
															{formatDate(
																enrol.created_at
															)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
							: "Empty"}
					</div>
				</div>
			</div>

			<Footer user={user} />
		</>
	);
}

export default MyPurchases;
