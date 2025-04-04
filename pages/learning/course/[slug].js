import React, { useEffect, useState } from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import StickyBox from "react-sticky-box";
import Player from "@/components/Learning/Player";
import { useRouter } from "next/router";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import VideoList from "@/components/Learning/VideoList";
import ProgressManager from "@/components/Learning/ProgressManager";
import CourseOverview from "@/components/Learning/CourseOverview";
import Link from "next/link";
import CourseAsset from "@/components/Learning/CourseAsset";
import CourseDiscussion from "@/components/Learning/CourseDiscussion";
import CourseRating from "@/components/Learning/CourseRating";
import CourseFeedback from "@/components/Learning/CourseFeedback";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import Router from "next/router";


const Index = ({ user, start_date, }) => {
	const [videos, setVideos] = useState([]);
	const [course, setCourse] = useState({});
	const [selectedVideo, setSelectedVideo] = useState("");
	const [active, setActive] = useState("");
	const [tab, setTab] = useState("overview");
	const { edmy_users_token } = parseCookies();
	const [isEnrolled, setIsEnrolled] = useState(false);
	const router = useRouter();
	const { id: courseId } = router.query;
	const [enrolmentStatus, setEnrolmentStatus] = useState("")
	const [enrollmentEndDate, setEnrollmentEndDate] = useState("");
	const [watchedVideos, setWatchedVideos] = useState([]);
	const { query: { slug } } = useRouter();
	const [assets, setAssets] = useState([]);
	const [progress, setProgress] = useState([]);


	// console.log("slug",router.query)








	const fetchVideos = async () => {
		const url = `${baseUrl}/api/learnings/videos/${slug}`;
		const payload = {
			headers: { Authorization: edmy_users_token },
		};
		const response = user?.id ? await axios.get(url, payload) : await axios.get(url);
		if (response.data?.videos?.length) {
			setVideos(response.data.videos);
			setSelectedVideo(response.data.videos[0].video);
			setActive(response.data.videos[0].id);
			setCourse(response.data.course);
			setIsEnrolled(response.data.isEnrolled);
			setEnrolmentStatus(response.data.enrolmentStatus)
			setEnrollmentEndDate(response.data.enrollmentEndDate);
			const watchedVideos = response.data.videos.filter(video => video.finished === true);
			setWatchedVideos(watchedVideos.map(video => video.id));
		}
	};

	useEffect(() => {
		fetchVideos();
	}, [slug, user?.id,]);


	// console.log("videos",videos.length)





	const selectVideo = async (videoId) => {
		try {
			await fetchProgress(true);
			const payload = {
				params: { userId: user?.id, courseId: course.id },
			};
			const url = `${baseUrl}/api/learnings/video/${videoId}`;

			const response = await axios.get(url, payload);
			if (response.data === "unauthorized") {
				cookie.remove("edmy_users_token");
				Router.push("/");
				return;
			}
			const {
				data: { video },
			} = response;

			setSelectedVideo(video.video);
			setActive(video.id);
			if (user && !watchedVideos.includes(videoId)) {
				setWatchedVideos([...watchedVideos, videoId]);

				await axios.post(`${baseUrl}/api/learnings/progress`, {
					userId: user?.id,
					courseId: course.id,
					videoId: videoId,
					finished: true,
				});
			}
		} catch (err) {
			console.log(err.response.data);
		}
	};


	const fetchAssets = async () => {
		const payload = {
			headers: { Authorization: edmy_users_token },
		};

		const url = `${baseUrl}/api/courses/course/assets/${course.id}`;

		const response = await axios.get(url, payload);
		setAssets(response.data.course_assets);
	};

	useEffect(() => {
		if (course.id) {
			fetchAssets();
			fetchProgress();
		}
	}, [course.id]);

	const fetchProgress = async (selected) => {
		const payload = {
			headers: { Authorization: edmy_users_token },
		};
		try {
			const response = await axios.get(
				`${baseUrl}/api/learnings/progress?userId=${user?.id}&courseId=${course.id}`,
				payload
			);
			console.log("==>>>", watchedVideos.length, response?.data?.courseProgress)
			if (selected || response?.data?.courseProgress?.filter((item) => item.finished).length > 1)
				setProgress(response.data.courseProgress);
		} catch (error) {
			console.error("Error fetching progress data", error);
		}
	};



	const isCurrentUserInstructor = user?.role === "instructor";







	return (
		<>
			<Navbar user={user} />



			<div className="mt-5 pb-5 video-area">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-9 col-md-8">
							<div className="video-content">
								{selectedVideo && (
									<Player videoName={selectedVideo} />
								)}

								<br />
								<ul className="nav-style1">
									<li>
										<Link href={`/learning/course/${slug}`}>
											<a
												onClick={(e) => {
													e.preventDefault();
													setTab("overview");
												}}
												className={
													tab == "overview"
														? "active"
														: ""
												}
											>
												Overview
											</a>
										</Link>
									</li>
									<li>
										<Link href={`/learning/course/${slug}`}>
											<a
												onClick={(e) => {
													e.preventDefault();
													setTab("asset");
												}}
												className={
													tab == "asset"
														? "active"
														: ""
												}
											>
												Assets
											</a>
										</Link>
									</li>
									<li>
										{/* <Link href={`/learning/course/${slug}`}>
											<a
												onClick={(e) => {
													e.preventDefault();
													setTab("discussion");
												}}
												className={
													tab == "discussion"
														? "active"
														: ""
												}
											>
												Discussion
											</a>
										</Link> */}
									</li>
								</ul>

								{course && tab == "asset" ? (
									<CourseAsset {...course} courseId={course.id} isEnrolled={isEnrolled} enrolmentStatus={enrolmentStatus} enrollmentEndDate={enrollmentEndDate} />
								) : tab == "discussion" ? (
									<CourseDiscussion {...course} />
								) : tab == "rating" ? (
									<CourseRating {...course} />
								) : tab == "feedback" ? (
									<CourseFeedback {...course} />
								) : (
									<CourseOverview {...course} />
								)}
							</div>
						</div>
						{console.log("===>>>", progress, progress.filter((item) => item.finished).length)}
						<div className="col-lg-3 col-md-4">
							<StickyBox offsetTop={20} offsetBottom={20}>
								<div className="video-sidebar">
									<ProgressManager
										videos_count={videos.length}
										userId={user?.id}
										courseId={course.id}
										selectedVideo={active}
										progressCount={progress?.filter((item) => item.finished).length}
									/>

									<div className="course-video-list">

										{!isEnrolled && !isCurrentUserInstructor && enrolmentStatus === "created" ? (
											<Link href={`/course/${slug}`}>
												<a className="button-37">
													Buy this Course to get full Access!
												</a>
											</Link>
										) : (
											null
										)}

										<h4 className="title mb-3 mt-3">
											{course && course.title}
										</h4>

										<ul>
											{videos.length > 0 &&
												videos.map((video) => (
													<VideoList
														key={video.id}
														{...video}
														onPlay={() =>
															selectVideo(
																video.id
															)
														}
														activeClass={active}
														isEnrolled={isEnrolled}
														enrolmentStatus={enrolmentStatus}
														enrollmentEndDate={enrollmentEndDate}
														watchedVideos={watchedVideos}
														progress={progress}
													/>
												))}
										</ul>
									</div>
								</div>
							</StickyBox>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Index;