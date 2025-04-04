import React, { useState, useEffect } from "react";
import controls from "@/utils/RTEControl";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
	ssr: false,
	loading: () => null,
});
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Button from "@/utils/Button";

const INITIAL_VALUE = {
	title: "",
	short_desc: "",
	testimonial: "",
	overview: "",
	latest_price: "",
	// before_price: 0,
	lessons: "",
	duration: "",
	image: "",
	access_time: "Monthly",
	requirements: "",
	what_you_will_learn: "",
	who_is_this_course_for: "",
	catId: "",
};

const CourseUpdateForm = ({ courseData }) => {
	const { edmy_users_token } = parseCookies();
	const [course, setCourse] = useState(INITIAL_VALUE);
	const [disabled, setDisabled] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [categories, setCategories] = useState([]);
	const [uploadImage, setUploadImage] = useState(false);
	const [imagePreview, setImagePreview] = React.useState("");
	const router = useRouter();

	useEffect(() => {
		const {
			title,
			short_desc,
			testimonial,
			overview,
			latest_price,
			// before_price,
			lessons,
			duration,
			image,
			access_time,
			requirements,
			what_you_will_learn,
			who_is_this_course_for,
			catId,
			imageUrl,
			rz_pay_product_id
		} = courseData;
		setCourse({
			title,
			short_desc,
			testimonial,
			overview,
			latest_price,
			// before_price:0,
			lessons,
			duration,
			image,
			access_time: "Monthly",
			requirements,
			what_you_will_learn,
			who_is_this_course_for,
			catId,
			imageUrl,
			rz_pay_product_id
		});
	}, [courseData]);

	useEffect(() => {
		const isCourse = Object.values(course).every((el) => Boolean(el));
		isCourse ? setDisabled(false) : setDisabled(true);
	}, [course]);

	useEffect(() => {
		const fetchData = async () => {
			const payload = {
				headers: { Authorization: edmy_users_token },
			};
			const response = await axios.get(
				`${baseUrl}/api/categories`,
				// `${baseUrl}/api/courses`,
				payload
			);
			setCategories(response.data.categories);
			// setCategories(response.data.course);

		};
		fetchData();
	}, []);

	const handleChange = (e) => {

		const { name, value, files } = e.target;

		if (name === "image") {
			const image = files[0].size / 1024 / 1024;
			if (image > 2) {
				toast.error(
					"The photo size greater than 2 MB. Make sure less than 2 MB.",
					{
						style: {
							border: "1px solid #ff0033",
							padding: "16px",
							color: "#ff0033",
						},
						iconTheme: {
							primary: "#ff0033",
							secondary: "#FFFAEE",
						},
					}
				);
				e.target.value = null;
				return;
			}
			setImagePreview(window.URL.createObjectURL(files[0]));
			setUploadImage(true)
			setCourse((prevState) => ({
				...prevState,
				image: files[0],
			}));

		} else {
			setCourse((prevState) => ({ ...prevState, [name]: value }));
		}
	};

	// const handleImageUpload = async () => {
	// 	const data = new FormData();
	// 	data.append("file", course.image);
	// 	data.append("upload_preset", process.env.UPLOAD_PRESETS);
	// 	data.append("cloud_name", process.env.CLOUD_NAME);
	// 	let response;
	// 	if (course.image) {
	// 		response = await axios.post(process.env.CLOUDINARY_URL, data);
	// 	}
	// 	const imageUrl = response.data.url;

	// 	return imageUrl;
	// };

	const handleUpload = async (type, file) => {
		const data = new FormData();
		data.append(type, file);
		let response;
		if (file) {
			const url = `${baseUrl}/api/upload?type=${type}`;
			const payloadHeader = {
				headers: { Authorization: edmy_users_token, 'Content-Type': 'multipart/form-data' },
			};
			response = await axios.post(url, data, payloadHeader);
		}
		const fileName = response.data.fileName;
		return fileName;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (categories.length)
			course.catId = categories[0].id
		const requiredFields = [
			"title",
			"lessons",
			"latest_price",
			// "before_price",
			"duration",
			"catId",
			"short_desc",
		];

		const missingFields = requiredFields.filter(
			(field) => !course[field]
		);

		if (missingFields.length > 0) {
			toast.error("Please fill in all required fields", {
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
			return;
		}
		try {
			// setLoading(true);
			// let photo;
			// if (course.image) {
			// 	photo = await handleImageUpload();

			// 	photo = photo.replace(/^http:\/\//i, "https://");
			// }
			setLoading(true);
			let photo;
			if (course.image && uploadImage) {
				photo = await handleUpload("image", course.image);
			}

			const {
				title,
				short_desc,
				testimonial,
				overview,
				latest_price,
				// before_price,
				lessons,
				duration,
				access_time,
				requirements,
				what_you_will_learn,
				who_is_this_course_for,
				catId,
				rz_pay_product_id
			} = course;
			const payloadData = {
				title,
				short_desc,
				testimonial,
				overview,
				latest_price,
				// before_price:0,
				lessons,
				duration,
				image: photo,
				access_time: "Monthly",
				requirements,
				what_you_will_learn,
				who_is_this_course_for,
				catId,
				rz_pay_product_id
			};

			const payloadHeader = {
				headers: { Authorization: edmy_users_token },
			};

			const url = `${baseUrl}/api/courses/course/${courseData.id}`;
			const response = await axios.put(url, payloadData, payloadHeader);
			setLoading(false);

			toast.success(response.data.message, {
				style: {
					border: "1px solid #4BB543",
					padding: "16px",
					color: "#4BB543",
				},
				iconTheme: {
					primary: "#4BB543",
					secondary: "#FFFAEE",
				},
			});

			router.push(`/instructor/courses`);
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
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="row">
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Course Title<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="text"
							className="form-control"
							placeholder="Course Title"
							name="title"
							value={course.title}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Lessons<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="5"
							name="lessons"
							value={course.lessons}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Price<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="number"

							className="form-control"
							placeholder="29.99"
							aria-describedby="latest_price_help"
							name="latest_price"
							value={course.latest_price}
							onChange={handleChange}
						/>
						<div id="latest_price_help" className="form-text">
							The latest price will show as the course price.
						</div>
					</div>
				</div>

				{/* <div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Regular Price<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="49.99"
							aria-describedby="before_price_help"
							name="before_price"
							value={course.before_price}
							onChange={handleChange}
						/>
						<div id="before_price_help" className="form-text">
							Regular price will show like this <del>49.99</del>.
						</div>
					</div>
				</div> */}

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Duration<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="text"

							className="form-control"
							placeholder="4 Hours or 2 Weeks"
							name="duration"
							value={course.duration}
							onChange={handleChange}
						/>
					</div>
				</div>

				{/* <div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Access Time
						</label>
						<select
							className="form-select"
							required
							name="access_time"
							value={course.access_time}
							onChange={handleChange}
						>
							<option value="">Select</option>
							<option value="Lifetime">Lifetime</option>
							<option value="Three Months">Three Months</option>
							<option value="Six Months">Six Months</option>
							<option value="1 Year">1 Year</option>
						</select>
					</div>
				</div> */}

				{/* <div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Course Category<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<select
							className="form-select"

							name="catId"
							value={course.catId}
							onChange={handleChange}
						>
							{categories?.length > 0 &&
								categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
						</select>
					</div>
				</div> */}

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Course Image<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="file"
							className="form-control file-control"
							name="image"
							onChange={handleChange}
							required={!course.imageUrl}
						/>
						<div className="form-text">
							Upload image size 750x500!
						</div>

						<div className="mt-2">
							<img
								src={imagePreview ? imagePreview : course.imageUrl}
								alt="image"
								className="img-thumbnail w-100px me-2"
							/>
						</div>
					</div>
				</div>


				<div className="col-md-12">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Short Description<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<textarea
							className="form-control"
							name="short_desc"
							value={course.short_desc}
							onChange={handleChange}
						/>
						<div className="form-text">
							The description will highlight all available areas.
						</div>
					</div>
				</div>

				<div className="col-md-12">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Testimonial
						</label>
						<textarea
							className="form-control"
							name="testimonial"
							value={course.testimonial}
							onChange={handleChange}
						/>
						<div className="form-text">
							The description will highlight all available areas.
						</div>
					</div>
				</div>


				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Overview
						</label>
						<RichTextEditor
							controls={controls}
							value={course.overview}
							onChange={(e) =>
								setCourse((prevState) => ({
									...prevState,
									overview: e,
								}))
							}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Requirements
						</label>
						<RichTextEditor
							controls={controls}
							value={course.requirements}
							onChange={(e) =>
								setCourse((prevState) => ({
									...prevState,
									requirements: e,
								}))
							}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							What You Will Learn
						</label>
						<RichTextEditor
							controls={controls}
							value={course.what_you_will_learn}
							onChange={(e) =>
								setCourse((prevState) => ({
									...prevState,
									what_you_will_learn: e,
								}))
							}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Who Is This Course For?
						</label>
						<RichTextEditor
							controls={controls}
							value={course.who_is_this_course_for}
							onChange={(e) =>
								setCourse((prevState) => ({
									...prevState,
									who_is_this_course_for: e,
								}))
							}
						/>
					</div>
				</div>

				<div className="col-12">
					<Button
						loading={loading}
						// disabled={disabled}
						btnText="Update Course"
						btnClass="default-btn"
					/>
				</div>
			</div>
		</form>
	);
};

export default CourseUpdateForm;
