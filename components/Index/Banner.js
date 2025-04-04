import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import SearchForm from "@/components/_App/SearchForm";
import AnimatedCharacters from "./BannerText";
import { motion } from "framer-motion";
import Categories from "./Categories";
import Slider from "react-slick";
import { BsFillSendFill } from "react-icons/bs";
 


const Banner = ({ categories, user }) => {
	const [currentIndex, setCurrentIndex] = useState(0);


	const headingTitle = [
		{
			type: "heading",
			text: "Demo.com",
		},
	];
	const headingText = [
		{
			type: "subheading",
			text: "some text",
		},
		{
			type: "subheading",
			text: "some text",
		},
		{
			type: "subheading",
			text: "some text",
		},
		{
			type: "subheading",
			text: "some text",
		},
		
	];




	const variants = {
		visible: {
			transition: {
				staggerChildren: 0.025,
			},
		},
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % headingText.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [headingText.length]);

	const fadeVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};


	const pVariants = {
		hidden: {
			scale: 0.8,
			opacity: 0,
		},
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				delay: 1.9,
			},
		},
	};
	const sliderSettings = {
		// dots: true,
		arrows: false,
		pauseOnHover: false,
		infinite: true,
		speed: 500,
		loop: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
	};

	return (
		<div className="banner-area bg-1 pb-5">
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6">
						<Slider {...sliderSettings}>
							<div className="banner-img">
								<motion.img
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									src="/images/banner/11.png"
									alt="banner"
								/>
							</div>
							{/* <div className="banner-img">
								<motion.img
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									src="/images/banner/12.png"
									alt="banner"
								/>
							</div> */}
							<div className="banner-img">
								<motion.img
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									src="/images/banner/14.png"
									alt="banner"
								/>
							</div>
							<div className="banner-img">
								<motion.img
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									src="/images/banner/15.png"
									alt="banner"
								/>
							</div>
							<div className="banner-img">
								<motion.img
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									src="/images/banner/16.png"
									alt="banner"
								/>
							</div>
						</Slider>
					</div>
					<div className=" banner-content text-wrap col-lg-6" >
						{/* <motion.div */}
						{/* initial="hidden"
							animate="visible"
							variants={variants}
							className="banner-content text-wrap"
						> */}
						{headingTitle.map((item, index) => {
							return (<>
								<AnimatedCharacters {...item} key={index} />
							</>

							);
						})}
						<motion.div
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={fadeVariants}
							key={currentIndex}
						>
							<AnimatedCharacters {...headingText[currentIndex]} />
						</motion.div>

						{/* {headingText.map((item, index) => {
								return (
									<AnimatedCharacters {...item} key={index} />
								);
							})} */}

						{/* </motion.div> */}
						{user ? (
							null

						) : (
							<motion.li whileTap={{ scale: 0.9 }} className="li-center">
								<Link href="/auth?action=register">
									<section id="style_four1">
										<div class="inner_box1">
										<button>
											<span id="like"><i><BsFillSendFill /></i></span>
											<a href="">Get Started</a>
											
										</button>
										</div>

									</section>
								</Link>

							</motion.li>
						)}
					</div>

				</div >
			</div>

			<img
				src="/images/banner/shape-1.svg"
				className="shape shape-1"
				alt="banner"
			/>
			<img
				src="/images/banner/shape-2.svg"
				className="shape shape-2"
				alt="banner"
			/>
			<img
				src="/images/banner/shape-3.svg"
				className="shape shape-3"
				alt="banner"
			/>
		</div >
	);
};

export default Banner;
