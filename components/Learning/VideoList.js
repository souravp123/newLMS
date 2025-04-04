import React, { useState, useEffect } from "react";
import { secondsToHms } from "@/utils/helper";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

const VideoList = ({
	id,
	video,
	title,
	short_id,
	video_length,
	onPlay,
	activeClass,
	isEnrolled,
	is_preview,
	enrolmentStatus,
	enrollmentEndDate,
	progress,
	group_name
}) => {
	const {
		query: { slug },
	} = useRouter();

	const currentDate = new Date();
	const isCourseExpired = currentDate > new Date(enrollmentEndDate);


	const isVideoWatched = progress.some((item) => item.videoId === id && item.finished);

	const isEnrolStatusIsActive = enrolmentStatus === "active";

	return (
		isEnrolled && !isCourseExpired && isEnrolStatusIsActive || is_preview ? (
			<li
				className={activeClass === id ? "active" : ""}
				onClick={() => onPlay(id)}
			>
				{short_id}{". "}{isVideoWatched && <span className="watched-label"> <FaCheckCircle /> </span>} {group_name}{" - "}{title}
				<span className="d-block text-muted fs-13 mt-1">
					<i className="bx bx-play-circle"></i>{" "}
					{secondsToHms(video_length)}
				</span>


			</li>
		) : (
			<Link href={`/course/${slug}`}>
				<li>
					<div className="" style={{ fontSize: "1rem" }} >
						{short_id}{". "}{group_name}{" - "}{title}
					</div>
					<span className="length d-block text-muted fs-13 ">
						<FaLock className="lockicon" />
						{secondsToHms(video_length)}
					</span>
				</li>
			</Link>
		)
	);
};

export default VideoList;
