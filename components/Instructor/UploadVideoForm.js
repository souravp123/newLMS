import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Button from "@/utils/Button";
import CreatableSelect from 'react-select/creatable';

const INITIAL_VALUE = {
	group_name: "",
	title: "",
	thumb: "",
	video: "",
	video_length: 0.0,
	is_preview: false,
	short_id: "",
	courseId: "",

};
const INITIAL_ASSET_VALUE = {
	lecture_name: "",
	lecture_file: "",
};

const UploadVideoForm = ({ courseId, onFetchAssets }) => {
	const { edmy_users_token } = parseCookies();
	const [video, setVideo] = useState(INITIAL_VALUE);
	const [asset, setAsset] = useState(INITIAL_ASSET_VALUE);
	const [disabled, setDisabled] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [groupNames, setGroupNames] = useState([]);
	const [groupName, setGroupName] = useState();
	const [thumbPreview, setThumbPreview] = React.useState("");
	const router = useRouter();
	const [videos, setVideos] = useState([]);
	const [sort_id, setSortID] = useState(0);




	useEffect(() => {
		setVideo((prevState) => ({ ...prevState, courseId }));
		setAsset((prevState) => ({ ...prevState, courseId }));
		fetchGroupNames();
	}, [courseId]);


	const fetchGroupNames = async () => {
		const payloadHeader = {
			headers: { Authorization: edmy_users_token },
		};
		try {
			const url = `${baseUrl}/api/courses/course/group?courseId=${courseId}`;
			const response = await axios.get(url, payloadHeader);

			if (Array.isArray(response.data)) {
				let gNames = [];
				response.data.forEach(x => {
					gNames.push({
						value: x, label: x
					})
				})
				setGroupNames(gNames);
			} else {
				setGroupNames([]);
				toast.error("Invalid group names response format", {
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
			const orderNoUrl = `${baseUrl}/api/courses/course/courseOrderNo?courseId=${courseId}`;
			const res = await axios.get(orderNoUrl, payloadHeader);
			video.short_id = res.data
			setVideo((prevState) => ({ ...prevState, courseId, short_id: res.data }))
			setSortID(res.data)
		} catch (error) {
			setGroupNames([]);
			toast.error("Error fetching info", {
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
	};


	useEffect(() => {
		let { group_name, title, video: video_url, courseId } = video;
		let { lecture_name, lecture_file } = asset;
		const isVideo = Object.values({
			group_name,
			title,
			video_url,
			courseId,
			lecture_name,
			lecture_file,
		}).every((el) => Boolean(el));
		isVideo ? setDisabled(false) : setDisabled(true);
	}, [video, asset]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		let fileSize;
		if (name === "thumb") {
			fileSize = files[0].size / 1024 / 1024;
			if (fileSize > 2) {
				toast.error(
					"The image size greater than 100 KB, Make sure less than 2 MB.",
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
			setVideo((prevState) => ({
				...prevState,
				thumb: files[0],
			}));
			setThumbPreview(window.URL.createObjectURL(files[0]));
		} else if (name === "video") {
			fileSize = files[0].size / 1024 / 1024;
			if (fileSize > 100) {
				toast.error(
					"The video size greater than 100 MB. Maximum allowed video file size is 100 MB",
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

			let media = new Audio(window.URL.createObjectURL(files[0]));
			media.onloadedmetadata = function () {
				setVideo((prevState) => ({
					...prevState,
					video: files[0],
					video_length: media.duration,
				}));
			};
		} else if (name === "lecture_file") {
			const fileSize = files[0].size / 1024 / 1024;
			if (fileSize > 5) {
				toast.error("The file size must be less than 5 MB.", {
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
				e.target.value = null;
				return;
			}
			setAsset(prevState => ({ ...prevState, lecture_file: files[0] }));
		} else {
			// setVideo((prevState) => ({ ...prevState, [name]: value }));
			const updateState = name === "lecture_name" ? setAsset : setVideo;
			updateState((prevState) => ({ ...prevState, [name]: value }));
		}
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
	const handleUpload = async (type, file) => {
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
			// response = await axios.post(url, formData, payloadHeader);
			try {
				response = await axios.post(url, formData, payloadHeader);
			} catch (error) {
				console.error(`Error uploading chunk ${i + 1}:`, error);
				throw error;
			}
		}
		return response.data.fileName;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		video.group_name = groupName.value;
		const requiredFields = ["group_name", "title", "video", "short_id",];


		if (video.short_id < sort_id) {
			toast.error(`Video order number must not be less than ${sort_id}`, {
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
			let thumbName = "";
			let assetName = "";
			if (video.video) {
				videoName = await handleUpload('video', video.video);
				if (video.thumb) {
					thumbName = await handleUpload('image', video.thumb);
				}
			}
			if (asset.lecture_file) {
				assetName = await handleUpload('assets', asset.lecture_file);
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
				group_name,
				title,
				thumb: thumbName,
				video: videoName,
				video_length,
				is_preview,
				short_id,
				courseId
			};
			// const assetPayload = {
			// 	...asset,
			// 	lecture_name: asset.lecture_name,
			// 	lecture_file: assetName,
			// 	courseId
			// };
			const url = `${baseUrl}/api/courses/course/upload/new`;
			const assetUrl = `${baseUrl}/api/courses/course/assets/${courseId}`;
			const payloadHeader = {
				headers: { Authorization: edmy_users_token },
			};
			const response = await axios.post(url, payloadData, payloadHeader);
			// await axios.post(assetUrl, assetPayload, {
			// 	headers: {
			// 		Authorization: edmy_users_token,
			// 		"Content-Type": "multipart/form-data"
			// 	}
			// });
			if (asset.lecture_name && asset.lecture_file) {
				const assetPayload = {
					lecture_name: asset.lecture_name,
					lecture_file: assetName,
					courseId,
				};

				const assetUrl = `${baseUrl}/api/courses/course/assets/${courseId}`;
				await axios.post(assetUrl, assetPayload, payloadHeader);
			}

			// await axios.post(assetUrl, assetPayload, payloadHeader);

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

			setLoading(false);
			if (onFetchAssets)
				onFetchAssets();
			router.push(`/instructor/course/uploads/${courseId}`);
			// router.push(`/instructor/course/assets/${courseId}`);

		} catch (err) {
			console.error("Error uploading file:", err);
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


	const addGroup = (opt) => {
		groupNames.push({
			value: opt, label: opt
		})
		setGroupName({
			value: opt, label: opt
		})
	}
	const groupChanged = (opt) => {
		setGroupName(opt)
	}

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: '54px',
			minHeight: '54px',
			backgroundColor: "#f0f1f2",
			borderColor: '',
			borderWidth: '1px',
			boxShadow: 'none',
			borderColor: state.isFocused ? '104e6c' : '#ced4da',
			'&:hover': {
				borderColor: '104c6e',
			},
		}),
	};


	const fetchVideos = async () => {
		setLoading(true);
		const payload = {
			headers: { Authorization: edmy_users_token },
		};

		const url = `${baseUrl}/api/courses/course/upload/${courseId}`;

		const response = await axios.get(url, payload);
		setVideos(response.data.videos);
		setLoading(false);
		console.log('Videos length:', response.data.videos.length);

	};

	useEffect(() => {
		fetchVideos();
	}, []);






	return (
		<form onSubmit={handleSubmit}>
			<div className="row">
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Video Group Title<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						{/* <select
							className="form-control"
							name="group_name"
							value={video.group_name}
							onChange={handleChange}
						>
							<option value="">Select Group</option>
							{groupNames.map((group, index) => (
								<option key={index} value={group}>
									{group}
								</option>
							))}
						</select> */}
						<div>
							<CreatableSelect
								isClearable
								options={groupNames}
								name="group_name"
								onCreateOption={(opt) => addGroup(opt)}
								onChange={(val) => groupChanged(val)}
								value={groupName}
								className="select_control"
								styles={customStyles}
							/>
						</div>

					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Video Title<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							// required
							type="text"
							className="form-control"
							placeholder="Video Title"
							name="title"
							value={video.title}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Select Thumbnail Image
						</label>
						<input
							type="file"
							className="form-control file-control"
							name="thumb"
							onChange={handleChange}
							required={false}
						/>
						<div className="form-text">
							Upload image size 1280x720!
						</div>

						<div className="mt-2">
							<img
								src={
									thumbPreview
										? thumbPreview
										: "/images/courses/course-1.jpg"
								}
								alt="image"
								className="img-thumbnail w-100px me-2"
							/>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Select Video<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="file"
							className="form-control file-control"
							name="video"
							onChange={handleChange}
						/>
						<div className="form-text">
							maximum allowed file size is 100 MB
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label className="form-label fw-semibold">
							Video Order Number (Ascending)<span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
						</label>
						<input
							type="number"
							className="form-control"
							placeholder="Video Order Number"
							name="short_id"
							value={video.short_id}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<input
							type="checkbox"
							className="form-check-input"
							id="is_preview"
							defaultChecked={video.is_preview}
							onChange={(e) =>
								setVideo((prevState) => ({
									...prevState,
									is_preview: !video.is_preview,
								}))
							}
						/>{" "}
						<label
							className="form-check-label"
							htmlFor="is_preview"
						>
							Preview Video?
						</label>
					</div>
				</div>
				{videos.length > 0 && (
					<>

						<div className="col-md-6">
							<div className="form-group">
								<label className="form-label fw-semibold">
									Assets Title
								</label>
								<input
									type="text"
									className="form-control"
									placeholder="Lecture Title"
									name="lecture_name"
									value={asset.lecture_name}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="col-md-6">
							<div className="form-group">
								<label className="form-label fw-semibold">
									Select Asset/File
								</label>
								<input
									type="file"
									className="form-control file-control"
									name="lecture_file"
									onChange={handleChange}
								// required={false}
								/>
								<div className="form-text">
									Upload file size less than or equal 5MB!
								</div>
							</div>
						</div>

					</>

				)}
				<div className="col-12">
					<Button
						loading={loading}
						// disabled={loading || disabled}
						btnText="Upload Video"
						btnClass="default-btn"
					/>
				</div>
			</div>
		</form>
	);
};

export default UploadVideoForm;
