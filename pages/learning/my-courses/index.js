import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import GeneralLoader from "@/utils/GeneralLoader";
import CourseCard from "@/components/Learning/CourseCard";
import { useRouter } from 'next/router'; 
import cookie from "js-cookie";
import Router from "next/router";
import { motion, AnimatePresence } from "framer-motion";


const Index = ({ user }) => {
	const { edmy_users_token } = parseCookies();
	const [enrolments, setEnrolments] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();


	useEffect(() => { 

		if (!edmy_users_token) {
			toast.error("User not authenticated");
			Router.push("/");
			return;
		}
		
		const fetchEnrols = async () => {
			setLoading(true);
			const payload = { 
				headers: { Authorization: edmy_users_token },
			};
			const response = await axios.get(
				`${baseUrl}/api/learnings`,
				payload
			);
			console.log("enroll api",response.data)

			if (response.data === "unauthorized") {
				cookie.remove("edmy_users_token");
				Router.push("/");
				return;
			}
			setEnrolments(response.data.enrolments);
			console.log("Enrolments:", response.data.enrolments); 

			const { initial } = router.query;
			if (response.data.enrolments.length === 0 && initial) {
				router.push('/');
			}
			setLoading(false);
		};

		fetchEnrols();
	}, []);


	return (
		<>
			<Navbar user={user} />

			<div className="ptb-100">
				<div className="container">
					<h2 className="fw-bold mb-4">My learning</h2>

					<ul className="nav-style1">
						<li>
							<Link href="/learning/my-courses/">
								<a className="active">All Courses</a>
							</Link>
						</li>
						<li>
							<Link href="/learning/wishlist/">
								<a>Wishlist</a>
							</Link> 
						</li>
					</ul>

					<div className="row">
						{!loading && (
							<>
								{enrolments.length === 0 ? (
								<motion.div
									className="col-lg-12 text-center"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 1 }}
								>
									<h3
										style={{
											textAlign: "center",
											fontWeight: "bold",
											color: "#0000001f",
											fontSize: "93px",
										}}
									>
										Empty
									</h3>
									<Link href="/courses">
										<a className="default-btn">
											Continue Shopping
										</a>
									</Link>
								</motion.div>
								) : (
									enrolments.map((enrol) => {
										const currentDate = new Date();
										const enrollmentEndDate = new Date(enrol.end_date);
										const isEnrollmentValid = enrollmentEndDate > currentDate;

										return <CourseCard key={enrol.id} {...enrol} user={user} userEmail={user.email} subscriptionStatus={enrol.rz_pay_subscription_status} subscriptionId={enrol.rz_pay_subscription_id} />;
									})
								)}
							</>
						)} 
					</div>
				</div>
			</div>

			<Footer user={user} />
		</>
	);
};

export default Index;
