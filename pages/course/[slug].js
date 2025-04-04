import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/_App/Navbar";
import PageBanner from "@/components/Common/PageBanner";
import CoursesDetailsContent from "@/components/SingleCourses/CoursesDetailsContent";
import Footer from "@/components/_App/Footer";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";

const courseDeatails = ({ user, isCurrentUserInstructor,  }) => {
	const [course, setCourse] = useState({});
	const router = useRouter();
	const { slug } = router.query;
	const [isCourseExpired, setIsCourseExpired] = useState(true);
	// const [priceInCurrency, setPriceInCurrency] = useState(null);

	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [currencyRates, setCurrencyRates] = useState({});



	const handleCurrencyChange = (currency) => { 
        setSelectedCurrency(currency);
    };


	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const payload = {
					params: { slug: slug },
				};
				const url = `${baseUrl}/api/courses/course`;
				const response = await axios.get(url, payload);
				setCourse(response.data.course);
				setIsCourseExpired(response.data.course.isCourseExpired);
				// setPriceInCurrency(priceInCurrency);

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

		fetchCourse();
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
	
	// console.log("slug currency", currency)
	// console.log("slug currencyrate", currencyRates)


	return (
		<>
			<Navbar user={user}  onCurrencyChange={handleCurrencyChange} />
			<PageBanner
				pageTitle={course && course.title}
				homePageUrl="/courses"
				homePageText="Courses"
				activePageText={course && course.title}
			/>
			{course && 
			<CoursesDetailsContent 
				user={user} 
				course={course}
				isCourseExpired={isCourseExpired} 
				isCurrentUserInstructor={isCurrentUserInstructor} 
				currency={selectedCurrency} 
				currencyRates={currencyRates} 
			/>}
			<Footer />
		</>
	);
};

export default courseDeatails;
