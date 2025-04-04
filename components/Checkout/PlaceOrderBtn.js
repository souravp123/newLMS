import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { calculateCartTotal } from "@/utils/calculateCartTotal";
import Script from 'next/script';

// import { DATE } from "sequelize";

const PlaceOrderBtn = ({ user, cartItems, localAmount }) => {
	const [stripeAmount, setStripeAmount] = React.useState(0);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const { stripeTotal } = calculateCartTotal(cartItems);
		setStripeAmount(stripeTotal);
	}, [cartItems]);

	const handleCheckout = async () => {
		setLoading(true);
		try {
			const storedCurrency = localStorage.getItem("selectedCurrency");
			const payload = {
				cartItems,
				userId: user.id,
				buyer_name: user.first_name,
				buyer_email: user.email,
				buyer_avatar: user.profile_photo,
				start_date: new Date().toString(),
				amount: localAmount,
				currency: storedCurrency
			};
			const url = `${baseUrl}/api/checkout`;
			const response = await axios.post(url, payload);


			const options = {
				key: "rzp_live_1fR5NlK36gp3Fv",
				// key: "rzp_test_FvLcfe89leeQQX",
				subscription_id: response.data.subscriptionId,
				name: 'Ivydude',
				description: response.data.description,
				image: "/images/logo3.png",
				handler: function (response) {
					router.push('/learning/my-courses');
				},
				prefill: {
					name: user.first_name,
					email: user.email,
				},
				theme: {
					color: '#104c6e',
				},
				callback_url: window.location.origin + "/learning/my-courses/",
				modal: {
					ondismiss: function () {
						router.push('/learning/my-courses/');
					}
				}
			};

			const rzp1 = new window.Razorpay(options);
			rzp1.open();

			// const paymentUrl = response.data.paymentUrl + '?return_url=' + window.location.origin + "/learning/my-courses/";
			// window.open(paymentUrl, '_blank');
			// pollingInterval = setInterval(fetchSubscriptionStatus, 3000);


		} catch (err) {
			console.error("Error during checkout:", err);
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
			setLoading(false);
		}
	};


	return (
		// <StripeCheckout 
		// 	name="Ivy Dude"
		// 	amount={stripeAmount}
		// 	email={user.email}
		// 	currency="USD"
		// 	stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
		// 	token={handleCheckout}
		// 	triggerEvent="onClick"
		// >
		<>
			<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
			<button
				className="default-btn"
				loading={loading}
				disabled={cartItems.length == 0 || loading}
				// btnText="Place Order"
				// btnClass="default-btn"
				onClick={handleCheckout}

			>
				{/* Subscribe Now */}
				{loading ? "Loading..." : "Subscribe Now"}

			</button>

		</>

		// </StripeCheckout>
	);
};

export default PlaceOrderBtn;
