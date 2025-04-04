import React, { useEffect, useState } from "react";
import Link from "next/link";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";

const CoursesCard = ({
	id,
	title,
	slug,
	short_desc,
	image: imageName,
	latest_price,
	before_price,
	lessons,
	is_class,
	user: { first_name, last_name, profile_photo },
	enrolments = [],
	onDelete,
	approved,
	currency,
	currencyRates
}) => {

	const canDelete = enrolments.length === 0;


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


	const handleDelete = () => {
		if (canDelete) {
			onDelete(id);
		} else {
			toast.error("You cannot delete this course because students are enrolled.", {
				style: {
					border: "2px solid red",
					color: "red"
				}
			});
		}
	};






	return (
		<div className="col-lg-4 col-md-6">
			<div className="teacher-courses-box" style={{ height: "37rem", overflow: "hidden" }}>
				<div className="courses-image">
					{is_class ? (
						<Link href={`/learning/course/class/${slug}`}>
							<a className="d-block image">
								<img
									src={
										image 
											? image
											: "/images/courses/courses1.jpg"
									}
									alt="image"
									style={{ width: '100%', height: '20rem', objectFit: 'contain' }}
								/>
							</a>
						</Link>
					) : (
						<Link href={`/course/${slug}`}>
							<a className="d-block image">
								<img
									src={
										image
											? image
											: "/images/courses/courses1.jpg"

									}
									style={{ width: '100%', height: '20rem', objectFit: 'contain' }}
									alt="image"
								/>
							</a>
						</Link>
					)}

					<div className="dropdown action-dropdown">
						<div className="icon">
							<i className="bx bx-dots-vertical-rounded"></i>
						</div>
						<ul className="dropdown-menu">
							<li>
								<Link href={`/instructor/course/edit/${id}`}>
									<a className="dropdown-item">
										{" "}
										<i className="bx bx-edit"></i> Edit
										Course
									</a>
								</Link>
							</li>
							<li>
								<Link href={`/instructor/course/upload/${id}`}>
									<a className="dropdown-item">
										<i className="bx bx-cloud-upload"></i>{" "}
										Upload Video
									</a>
								</Link>
							</li>
							<li>
								<Link href={`/instructor/course/batchUpload/${id}`}>
									<a className="dropdown-item">
										<i className="bx bx-cloud-upload"></i>{" "}
										Batch Upload
									</a>
								</Link>
							</li>
							<li>
								<Link href={`/instructor/course/uploads/${id}`}>
									<a className="dropdown-item">
										<i className="bx bxs-edit-alt"></i> Edit
										Video
									</a>
								</Link>
							</li>
							<li>
								<Link href={`/instructor/course/assets/${id}`}>
									<a className="dropdown-item">
										<i className="bx bxs-file-plus"></i>{" "}
										Assets
									</a>
								</Link>
							</li>
							<li>
								<button
									onClick={handleDelete}
									type="button"
									className="dropdown-item"
								>
									<i className="bx bxs-trash"></i> Delete
								</button>
							</li>
						</ul>
					</div>

					<>
						{/* {before_price > 0 && (
							<div className="price shadow discount-price">
								<del>${before_price}</del>
							</div>
						)} */}
						<div className="price shadow">
							${latest_price > 0 ? latest_price : "Free"}
						</div>
					</>
				</div>
				<div className="courses-content">
					<div className="course-author d-flex align-items-center">
						<img
							src={
								profile_photo
									? profile_photo
									: "/images/user1.jpg"
							}
							className="rounded-circle"
							alt={first_name}
						/>
						<span>{`${first_name} ${last_name}`}</span>
					</div>

					<h3>
						{is_class ? (
							<Link href={`/learning/course/class/${slug}`}>
								<a>{title.slice(0, 40)}...</a>
							</Link>
						) : (
							<Link href={`/course/${slug}`}>
								<a>{title.slice(0, 40)}...</a>
							</Link>
						)}
					</h3>

					<p
						style={{ maxHeight: "5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
						{short_desc.slice(0, 108)}
					</p>
					<ul className="courses-box-footer d-flex justify-content-between align-items-center">
						<li>
							<i className="flaticon-agenda"></i> {lessons}{" "}
							Lessons
						</li>
						<li>
							<i className="flaticon-people"></i>{" "}
							{enrolments.length} Students
						</li>
					</ul>
					<div className="text-center mt-4">
						{!approved && <p style={{ color: "red", backgroundColor: "" }}>Waiting for Admin Approval</p>}
					</div>

				</div>
			</div>

		</div>
	);
};

export default CoursesCard;
