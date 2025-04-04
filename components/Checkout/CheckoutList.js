import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useIsPresent } from "framer-motion";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import { useRouter } from "next/router";


const CheckoutList = ({
	id,
	image: imageName,
	title,
	instructor,
	slug,
	price,
	regular_price,
	lessons,
	duration,
	access_time,
	onRemove,
	currency,
	currencyRates
}) => {
	const router = useRouter(); 
	const isPresent = useIsPresent();
	const anitmations = {
		style: {
			position: isPresent ? "static" : "absolute",
		},
		initial: { scale: 0, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0, opacity: 0 },
	};

	const [image, setImage] = useState('');
	const { edmy_users_token } = parseCookies();
	useEffect(() => {
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
	}, [imageName]);

	const getPriceInCurrency = (price) => {
		const rate = currencyRates[currency] || 1;
		return (price * rate).toFixed(2); 
	};

	return (
		<motion.li
			className="single-cart-list d-flex justify-content-between align-items-center"
			layout
			{...anitmations}
		>
			<div className="single-cart-content d-flex align-items-center" style={{ minHeight: "9rem" }}
			>
				<Link href={`/course/${slug}`}>
					<a>
						<img src={image} alt={title}
						/>
					</a>
				</Link>
				<div className="single-cart-contents">
					<h3>
						<Link href={`/course/${slug}`}>
							<a>{title}</a>
						</Link>
					</h3>
					<p>By {instructor}</p>
					<ul className="lectures">
						<li>
							{lessons} <span>Lectures</span>
						</li>
						<li>
							{duration} <span>Total Length</span>
						</li>
					</ul>
				</div>
			</div>
			<div className="prw">
				<h4>
					{/* {regular_price > 0 && <del>USD {regular_price}</del>} */}
					{currency} {getPriceInCurrency(price)}
				</h4>
				<div className="wis-rem d-flex align-items-center">
					<button onClick={() => onRemove(id)} className="remove">
						Remove
					</button>
				</div>
			</div>
		</motion.li>
	);
};

export default CheckoutList;
