import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import CourseUpdateForm from "@/components/Instructor/CourseUpdateForm";
import { useRouter } from "next/router";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import PageNavigation from "../../../../components/Instructor/PageNavigation";

const Create = ({ user }) => {
	const { edmy_users_token } = parseCookies();
	const router = useRouter();
	const { id: courseId } = router.query;
	const [course, setCourse] = useState({});

	useEffect(() => {
		const fetchCourse = async () => {
			const payload = {
				headers: { Authorization: edmy_users_token },
			};
			const url = `${baseUrl}/api/courses/course/${courseId}`;
			const response = await axios.get(url, payload);
			response.data.course.imageUrl = await fetchImage(response.data.course.image);
			setCourse(response.data.course);
		};

		fetchCourse();
	}, []);


	const fetchImage = async (image) => {
		if (image) {
			const url = `${baseUrl}/api/get-image?imageName=${image}`;
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
					return imageUrl;
				} else {
					console.error('Failed to fetch images:', response);
					return ""
				}
			} catch (error) {
				console.error('Error fetching image:', error);
				return "";
			}
		}
	};

	return (
		<>
			<Navbar user={user} />

			<div className="ptb-100">
				<div className="container">
					<PageNavigation
						courseId={courseId}
						activeClassname="edit"
					/>

					<div className="create-course-form">
						{course && <CourseUpdateForm courseData={course} />}
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Create;
