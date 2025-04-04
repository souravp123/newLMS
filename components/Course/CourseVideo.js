import baseUrl from "@/utils/baseUrl";
import { secondsToHms } from "@/utils/helper";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import FsLightbox from "fslightbox-react";
import Player from "../Learning/Player";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import { useRouter } from "next/router";


const dropIn = {
	hidden: {
		y: "-100vh",
		opacity: 0,
	},
	visible: {
		y: "0",
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		y: "100vh",
		opacity: 0,
	},
};

const CourseVideo = ({ courseSlug,  current_user }) => {
	const [videos, setVideos] = useState([]); 
	const [preview, setPreview] = useState("");
	const [toggler, setToggler] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const url = `${baseUrl}/api/learnings/videos/${courseSlug}`;
				const response = await axios.get(url);
				setVideos(response.data.videos);
			} catch (error) {
				console.error("Error fetching videos:", error);
			}
		};
		fetchVideos();
	}, [courseSlug]); 

	

	return (
		<>
			<div className="courses-curriculum">
				<ul>
					{videos &&
						videos.map((v) => (

							<li key={v.id}>
								<div className="d-flex justify-content-between align-items-center">
									<span className="courses-name">
										{v.title}
									</span>
									<div className="courses-meta">
										<span className="duration">
											{secondsToHms(v.video_length)}
										</span>
										{v.is_preview ? ( 
											<a href={`/learning/course/${courseSlug}`}>
												<span
												className="status"
												onClick={() => {
													// setPreview(v.video);
													setToggler(!toggler);
												}}
											>
												preview
											</span>
											</a>
										) : (
											<span
												className="status locked"
												title="Premium"
											>
												<i className="flaticon-password"></i>
											</span>
										)}
										{/* {v.is_preview ? (
											<a href={`/learning/course/${courseSlug}`}>
												<span
													className="status"
													onClick={() => handlePreviewClick(v.video)}
												>
													preview
												</span>
											</a>
										) : (
											<span
												className="status locked"
												title="Premium"
											>
												<i className="flaticon-password"></i>
											</span>
										)} */}
										
									</div>
								</div>
							</li>
						))}
				</ul>
			</div>

			{/* {preview && <FsLightbox toggler={toggler} sources={[preview]} />} */}
			{preview && toggler &&
				<Backdrop>
					<motion.div
						className="modal fade show"
						onClick={(e) => e.stopPropagation()}
						variants={dropIn}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<button
									type="button"
									className="btn-close"
									onClick={() => setToggler(!toggler)}
								>
									<i className="bx bx-x"></i>
								</button>
								<Player videoName={preview} />
							</div>
						</div>
					</motion.div>
				</Backdrop>}
		</>
	);
};

export default CourseVideo;
