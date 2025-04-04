import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Button from "@/utils/Button";
import ProgressBar from "@ramonak/react-progress-bar";

const INITIAL_VALUE = [];
const INITIAL_OBJ = {
	group_name: "",
	title: "",
	thumb: "",
	video: "",
	video_length: 0.0,
	is_preview: false,
	short_id: 0,
	courseId: "",
};

const BatchUploadForm = ({ courseId }) => {
	const { edmy_users_token } = parseCookies();
	const [videos, setVideos] = useState(INITIAL_VALUE);
	const [progress, setProgress] = useState([]);
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [thumbPreview, setThumbPreview] = useState("");
	const [groupName, setGroupName] = useState("");
	const [sort_id, setSortID] = useState(1);
	const router = useRouter();

	useEffect(() => {
		init();
	}, [])

	const init = async () => {
		const payloadHeader = {
			headers: { Authorization: edmy_users_token },
		};
		const orderNoUrl = `${baseUrl}/api/courses/course/courseOrderNo?courseId=${courseId}`;
		const res = await axios.get(orderNoUrl, payloadHeader);
		setSortID(res.data)
		console.log("Sort ID:", res.data);
		console.log(orderNoUrl)

	}

	const handleChange = (e) => {
		const { files } = e.target;
		[...files].forEach((file, index) => {
			let fileSize;
			fileSize = file.size / 1024 / 1024;
			if (fileSize > 50) {
				toast.error(
					"A few of the videos have file sizes larger than 50 MB. skipped.",
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
				return;
			}
			let media = new Audio(window.URL.createObjectURL(file));
			media.onloadedmetadata = function () {
				setVideos((prevState) => ([
					...prevState, {
						...INITIAL_OBJ,
						video: file,
						group_name: groupName,
						video_length: media.duration,
						short_id: prevState.length === 0 ? sort_id : sort_id + prevState.length,
						title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
						// is_preview: prevState.length < 2 ? true : false,
						courseId: courseId
					}
				]));
				// setProgress((prevProgress) => ([
				// 	...prevProgress, { videoIndex: progress.length, percentage: 0 }
				// ]));
			};
		});
	};

	const createFileChunks = (file, chunkSize = 1 * 1024 * 1024) => {
		const chunks = [];
		let currentChunkIndex = 0;
		while (currentChunkIndex < file.size) {
			chunks.push(file.slice(currentChunkIndex, currentChunkIndex + chunkSize));
			currentChunkIndex += chunkSize;
		}
		return chunks;
	};

	const generateRandomFileName = (originalFileName) => {
		const fileExtension = originalFileName.split('.').pop();
		const timestamp = Date.now();
		const randomText = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
		return `${randomText}_${timestamp}.${fileExtension}`;
	};

	const handleUpload = async (type, file, videoIndex) => {
		const chunks = createFileChunks(file);
		const totalChunks = chunks.length;
		const randomFileName = generateRandomFileName(file.name);
		let response = null;

		for (let i = 0; i < totalChunks; i++) {
			const formData = new FormData();
			formData.append('chunk', chunks[i]);
			formData.append('chunkIndex', i);
			formData.append('totalChunks', totalChunks);
			formData.append('fileName', randomFileName);
			formData.append('type', type);
			const url = `${baseUrl}/api/uploadChunks`;
			const payloadHeader = {
				headers: { Authorization: edmy_users_token, 'Content-Type': 'multipart/form-data' },
			};

			try {
				response = await axios.post(url, formData, {
					...payloadHeader,
					onUploadProgress: (progressEvent) => {
						// const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						// setProgress((prevProgress) => {
						// 	const newProgress = [...prevProgress];
						// 	newProgress[videoIndex] = { videoIndex, percentage: percentCompleted };
						// 	return newProgress;
						// });
					}
				});
				const percentCompleted = Math.round(((i + 1) * 100) / totalChunks);
				setProgress((prevProgress) => {
					const newProgress = [...prevProgress];
					newProgress[videoIndex] = { videoIndex, percentage: percentCompleted };
					return newProgress;
				});
			} catch (error) {
				console.error(`Error uploading chunk ${i + 1}:`, error);
				throw error;
			}
		}
		return response.data.fileName;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const requiredFields = ["group_name", "title", "video", "short_id"];
		let completedUploads = 0;

		// for (let videoIndex = 0; videoIndex < videos.length; videoIndex++) {
		// 	const video = videos[videoIndex];
		// 	if (video.short_id < sort_id) {
		// 		toast.error(`Video order number must not be less than ${sort_id}`, {
		// 			style: {
		// 				border: "1px solid #ff0033",
		// 				padding: "16px",
		// 				color: "#ff0033",
		// 			},
		// 			iconTheme: {
		// 				primary: "#ff0033",
		// 				secondary: "#FFFAEE",
		// 			},
		// 		});
		// 		return;
		// 	}
		// }

		for (let videoIndex = 0; videoIndex < videos.length; videoIndex++) {
			const video = videos[videoIndex];
			video.group_name = groupName

			// if (video.short_id < sort_id) {
			// 	toast.error(`Video order number must not be less than ${sort_id}`, {
			// 		style: {
			// 			border: "1px solid #ff0033",
			// 			padding: "16px",
			// 			color: "#ff0033",
			// 		},
			// 		iconTheme: {
			// 			primary: "#ff0033",
			// 			secondary: "#FFFAEE",
			// 		},
			// 	});
			// 	return;
			// }

			const missingFields = requiredFields.filter(field => !video[field]);
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
				setLoading(true);
				let videoName = "";
				if (video.video) {
					videoName = await handleUpload('video', video.video, videoIndex);
				}
				const {
					group_name,
					title,
					video_length,
					is_preview,
					short_id,
					courseId,
				} = video;

				const payloadData = {
					group_name: groupName,
					title,
					thumb: "",
					video: videoName,
					video_length,
					is_preview,
					short_id:video.short_id,
					courseId
				};
				const url = `${baseUrl}/api/courses/course/upload/new`;
				const payloadHeader = {
					headers: { Authorization: edmy_users_token },
				};
				const response = await axios.post(url, payloadData, payloadHeader);

				completedUploads++;

				if (completedUploads === videos.length) {
					toast.success("All videos have been successfully uploaded.", {
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
					router.push(`/instructor/course/uploads/${courseId}`);
				}
			} catch (err) {
				console.error("###########Error uploading file:", err);
				// let {
				// 	response: {
				// 		data: { message },
				// 	},
				// } = err;
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
			}
		}


		setLoading(false);
		// router.push(`/instructor/course/batchUpload/${courseId}`);
	};

	const updatePreview = (inx) => {
		videos[inx].is_preview = !videos[inx]?.is_preview;
		setVideos([...videos]);
	};

	const updateBulk = (e, inx) => {
		const updatedShortId = parseInt(e.target.value, 10);
		const updatedVideos = [...videos];
	  
		const existingVideoIndex = updatedVideos.findIndex(
		  (video, index) => video.short_id === updatedShortId && index !== inx
		);
	  
		if (existingVideoIndex !== -1) {
		  const maxShortId = Math.max(...updatedVideos.map((v) => v.short_id));
		  updatedVideos[existingVideoIndex].short_id = maxShortId + 1;
		}
	  
		updatedVideos[inx][e.target.name] = updatedShortId;
	  
		updatedVideos.sort((a, b) => a.short_id - b.short_id);
	  
		setVideos(updatedVideos);
	  };
	
	

	const updateGroupName = (e) => {
		setGroupName(e.target.value);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="row">
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Video Group Title<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="text"
							className="form-control"
							placeholder="Group Title"
							name="group_name"
							value={groupName}
							onChange={updateGroupName}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Select Videos<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="file"
							className="form-control file-control"
							name="video"
							onChange={handleChange}
							multiple
						/>
					</div>
				</div>
				{videos.map((element, inx) => {
					return (
						<React.Fragment key={inx}>
							<div className="col-md-3">
								<div className="form-group">
									<label className="form-label fw-semibold">
										Video Title<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
									</label>
									<input
										type="text"
										className="form-control"
										placeholder="Video Title"
										name="title"
										value={element.title}
										onChange={(e) => updateBulk(e, inx)}
									/>
								</div>
							</div>
							<div className="col-md-3">
								<div className="form-group">
									<label className="form-label fw-semibold">
										Video Order Number (Ascending)<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
									</label>
									<input
										type="number"
										className="form-control"
										placeholder="Video Order Number"
										name="short_id"
										value={element.short_id}
										onChange={(e) => updateBulk(e, inx)}
									/>
								</div>
							</div>
							<div className="col-md-3 mt-5">
								<div className="form-group">
									<input
										type="checkbox"
										className="form-check-input"
										id="is_preview"
										checked={element.is_preview}
										onChange={() => updatePreview(inx)}
									/>{" "}
									<label className="form-check-label" htmlFor="is_preview">
										Preview Video?
									</label>
								</div>
							</div>
							{loading ? <div className="col-md-3 mt-4">
								{progress[inx]?.percentage === 100 ? "Uploaded" : "Uploading..."}
								<div className="mb-3">
									<ProgressBar
										// completedClassName="barCompleted"
										// barContainerClassName="container2"
										// baseBgColor="white"
										completed={progress[inx]?.percentage || 0} />
								</div>
							</div> : <div className="col-md-3 mt-4">

								<div className="mb-3">
								</div>
							</div>}
						</React.Fragment>
					);
				})}

				<div className="col-12">
					<Button
						loading={loading}
						btnText="Upload Video"
						btnClass="default-btn"
					/>
				</div>
			</div>
		</form>
	);
};

export default BatchUploadForm;
