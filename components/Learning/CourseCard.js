import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import Link from "next/link";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";


const CourseCard = ({ course: { user, image: imageName, title, slug, is_class }, end_date, userEmail, subscriptionStatus, subscriptionId }) => {
	const [image, setImage] = useState('');
	const { edmy_users_token } = parseCookies();
	const [isCourseExpired, setIsCourseExpired] = useState(true);
	const [formattedEndDate, setFormattedEndDate] = useState('');




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

	useEffect(() => {
		const currentDate = new Date();
		const enrollmentEndDate = new Date(end_date);

		const renewalDate = new Date(enrollmentEndDate);
		renewalDate.setDate(renewalDate.getDate() - 2);

		setFormattedEndDate(enrollmentEndDate.toLocaleDateString())



		if (
			currentDate.getFullYear() === renewalDate.getFullYear() &&
			currentDate.getMonth() === renewalDate.getMonth() &&
			currentDate.getDate() === renewalDate.getDate()
		) {
			sendReminderEmail();
		}

		setIsCourseExpired(currentDate > enrollmentEndDate);
	}, [end_date, userEmail]);

	const sendReminderEmail = async () => {
		try {
			await axios.post(`${baseUrl}/api/learnings/reminder`, {
				email: userEmail,
				courseTitle: title,
				renewalDate: end_date,
			});
		} catch (error) {
			console.error("Error sending reminder email:", error);
		}
	};


	const handleDelete = async () => {
		if (subscriptionStatus === 'cancelled') {
			toast.error("This subscription is already cancelled.", {
				style: {
					border: "1px solid red",
					padding: "16px",
					color: "red",
				},
			})

			return;
		} else {
			toast.error("Your cancellation request is being processed. You'll be notified once it's complete.", {
				style: {
					border: "1px solid green",
					padding: "16px",
					color: "green",
				},
			})
		}
		try {

			const response = await axios.post(
				`${baseUrl}/api/checkout/sub-cancel`,
				{ subscriptionId },
				{
					headers: {
						Authorization: edmy_users_token,
					},
				}
			);
			setIsCourseExpired(true);
			toast.success("Subscription cancelled successfully.", {
				style: {
					border: "1px solid green",
					padding: "16px",
					color: "green",
				},
			});
			window.location.reload();

		} catch (error) {
			console.error("Error cancelling subscription:", error);
		}
	};

	const confirmDelete = () => {
		confirmAlert({
			title: 'Cancel Subscription ',
			message: `Are you sure you want to cancel subscription for ${title}?`,
			buttons: [
				{
					label: 'Yes',
					onClick: handleDelete
				},
				{
					label: 'No'
				}
			]
		});
	};






	return (
		<div className="col-lg-4 col-md-6">
			<div className="single-courses-box style-2" style={{ height: "35rem" }}>
				<div className="courses-image">
					{!isCourseExpired || subscriptionStatus !== "created" ? (
						<Link href={`/learning/course/${slug}`}>
							<a className="d-block image">
								<img src={image} alt={title} style={{ objectFit: "fill", height: "18rem", width: "100%" }} />
							</a>
						</Link>
					) : (
						<Link href={`/course/${slug}`}>
							<a className="d-block image">
								<img src={image} alt={title} style={{ objectFit: "fill", height: "18rem", width: "100%" }} />
							</a>
						</Link>
					)}
					{subscriptionStatus !== "cancelled" && subscriptionStatus !== "created" && (
						<div className="dropdown action-dropdown" style={{ zIndex: "1" }}>
							<div className="icon">
								<i className="bx bx-dots-vertical-rounded"></i>
							</div>
							<ul className="dropdown-menu" style={{ width: "12rem" }}>
								<li>
									<button
										onClick={confirmDelete}
										type="button"
										className="dropdown-item"
									>
										<i className="bx bxs-trash"></i> Cancel Subscription
									</button>
								</li>
							</ul>
						</div>
					)}

					<div className="video_box">
						<div className="d-table">
							<div className="d-table-cell">
								{(!isCourseExpired && subscriptionStatus !== "created") ? (
									<Link href={`/learning/course/${slug}`}>
										<a>
											<i className="bx bx-play"></i>
										</a>
									</Link>
								) : (
									<a href="javascript:void(0);">
										<i className="bx bx-play" style={{ color: "#ccc", cursor: "not-allowed" }}></i>
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="courses-content mt-2">
					<h3>
						{!isCourseExpired || subscriptionStatus !== "created" ? (
							<Link href={`/learning/course/${slug}`}>
								<a>{title}</a>
							</Link>
						) : (
							<Link href={`/course/${slug}`}>
								<a>{title}</a>
							</Link>
						)}
					</h3>

					<div className="course-author d-flex justify-content-between">
						<span>{`${user.first_name} ${user.last_name}`}</span>
						{!isCourseExpired && subscriptionStatus !== "created" ? (
							<Link href={`/learning/course/${slug}`}>
								<a>Start Course</a>
							</Link>
						) : null}
					</div>
					{subscriptionStatus === "created" && (
						<p style={{ color: "#104c6e", fontWeight: "900", textAlign: "center", marginTop: "1rem" }}>
							Subscription Pending<br />Check your email to complete payment

						</p>
					)}
					{subscriptionStatus === "cancelled" && (
						<p style={{ color: "#104c6e", fontWeight: "900", textAlign: "center", marginTop: "1rem" }}>
							Subscription Cancelled<br />Renew Subscription

						</p>
					)}
					{isCourseExpired && (
						<p
							style={{
								color: "red",
								fontWeight: "900",
								textAlign: "center",
								marginTop: "1rem",
							}}
						>
							Subscription Expired
						</p>
					)}
					{isCourseExpired && (
						<div className="text-center">
							<a href={`/course/${slug}`}>
								Renew Subscription Now
							</a>
						</div>
					)}
				</div>
			</div>

		</div>


	);
};

export default CourseCard;
