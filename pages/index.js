import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import CoursesList from "@/components/Courses/CoursesList";
import Banner from "@/components/Index/Banner";
import Navbar from "@/components/_App/Navbar";
import BookLiveTutoring from "@/components/Index/BookLiveTutoring";
import Categories from "@/components/Index/Categories";
import Transform from "@/components/Index/Transform";
import Features from "@/components/Index/Features";
import SliderCoursesList from "@/components/Courses/SliderCoursesList"
import Testimonials from "@/components/Index/Testimonials";
import Partners from "@/components/Index/Partners";
import Teaching from "@/components/Index/Teaching";
import Business from "@/components/Index/Business";
import Footer from "@/components/_App/Footer";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import { motion } from "framer-motion";

const index = ({ courses, categories, user }) => {
	const [selectedCurrency, setSelectedCurrency] = useState('USD');
	const [currencyRates, setCurrencyRates] = useState({});


	const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
    };



	const variants = {
		visible: {
			opacity: 1,
			scale: 1,
			transition: { delay: 0.2, type: "spring", duration: 1 },
		},
		hidden: { opacity: 0, scale: 0 },
	};

	const isCurrentUserInstructor = user && user.role === "instructor";

	// useEffect(() => {
    //     const fetchCurrencyRates = async () => {
    //         try {
    //             const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    //             const data = await response.json();
    //             setCurrencyRates(data.rates);
    //         } catch (error) {
    //             console.error('Error fetching currency rates:', error);
    //         }
    //     };

    //     fetchCurrencyRates();
    // }, []);

	useEffect(() => {
        const fetchCurrencyRates = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/currency`);
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
			<Navbar user={user} onCurrencyChange={handleCurrencyChange}/>
			<Banner categories={categories} user={user} />
			{(!user || user.role === "student") && <div className="courses-area pt-50 pb-70 mt-2 ">
				<div className="container">
					<motion.div
						className="section-title"
						initial="hidden" 
						whileInView="visible"
						variants={variants}
					>
						<h2>Add some text here</h2>
						{!user && <h5>add some text if user not logged in</h5>}
					</motion.div>
					{/* <CoursesList courses={courses} user={user} /> */}
					<SliderCoursesList courses={courses} user={user} currency={selectedCurrency} currencyRates={currencyRates}/>
				</div>
			</div>}

			<Features />
			<Testimonials user={user} />
			<Partners />
			{isCurrentUserInstructor ? null : <BookLiveTutoring />}
			{/* <Teaching user={user} /> */}
			<Footer user={user} /> 
		</>
	);
};

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API
	// const res = await fetch(`${baseUrl}/api/home-courses/`);
	// const { courses, categories } = await res.json();

	const payload = {
		params: {
			page: 1,
			limit: 200,
			short: "",
			search: "",
		},
	};
	const response = await axios.get(`${baseUrl}/api/all-courses`, payload);

	// Pass data to the page via props
	return { props: { courses: response.data.courses, categories: [] } };
}

export default index;
