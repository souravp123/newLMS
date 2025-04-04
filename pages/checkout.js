import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CheckoutForm from "@/components/Checkout/CheckoutForm";
import PageBanner from "@/components/Common/PageBanner";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";

const checkout = ({ user }) => {
	const [course, setCourse] = useState({});
	const router = useRouter();
	const { slug } = router.query;
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [currencyRates, setCurrencyRates] = useState({});


	const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
    };

	
	// const isCurrentUserInstructor = user && user.role === "instructor";

	useEffect(() => {
        const fetchCourse = async () => {
            try {
                const payload = {
                    params: { slug: slug },
                };
                const url = `${baseUrl}/api/courses/course`;
                const response = await axios.get(url, payload);
                setCourse(response.data.course);
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

        if (slug) {
            fetchCourse();
        }
    }, [slug]);

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
 
	return (
		<>
			<Navbar user={user} onCurrencyChange={handleCurrencyChange} />
			<PageBanner
				pageTitle="Checkout"
				homePageUrl="/courses"
				homePageText="Courses"
				activePageText="Subscription"
				// activePageText={course.title}
			/>
			<CheckoutForm user={user} isCurrentUserInstructor={user && user.role === 'instructor'} currency={selectedCurrency} currencyRates={currencyRates} />
			<Footer user={user} />
		</>
	);
};

export default checkout;
