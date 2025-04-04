import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Button from "@/utils/Button";

const INITIAL_VALUE = {
	lecture_name: "",
	lecture_file: "",
};

const UploadAssetForm = ({ courseId, onFetchAssets }) => {
	const { edmy_users_token } = parseCookies();
	const [asset, setAsset] = useState(INITIAL_VALUE);
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [videos, setVideos] = useState([]);


	useEffect(() => {
		setAsset((prevState) => ({ ...prevState, courseId }));
	}, [courseId]);

	useEffect(() => {
		const isAsset = Object.values(asset).every((el) => Boolean(el));
		setDisabled(!isAsset);
	}, [asset]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		let fileSize;
		if (name === "lecture_file") {
			fileSize = files[0].size / 1024 / 1024;
			if (fileSize > 5) {
				toast.error(
					"The file size is greater than 5 MB. Please select a smaller file.",
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
			setAsset((prevState) => ({
				...prevState,
				lecture_file: files[0],
			}));
		} else {
			setAsset((prevState) => ({ ...prevState, [name]: value }));
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
		const randomText = Math.random().toString(36).substring(2, 8);
		return `${randomText}_${timestamp}.${fileExtension}`;
	};

	const handleUpload = async (type, file) => {
		const chunks = createFileChunks(file);
		const totalChunks = chunks.length;
		const randomFileName = generateRandomFileName(file.name);
		let response = null;

		for (let i = 0; i < totalChunks; i++) {
			console.log(`Uploading chunk ${i + 1} of ${totalChunks} for file ${randomFileName}`);
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
				response = await axios.post(url, formData, payloadHeader);
				console.log(`Successfully uploaded chunk ${i + 1} of ${totalChunks}`);

			} catch (error) {
				console.error(`Error uploading chunk ${i + 1}:`, error);
				throw error;
			}
		}
		return response.data.fileName;
	};

	const handleSubmit = async (e) => {
		if (videos.length === 0) {
			toast.error("Please upload at least one video before adding assets.", {
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
		e.preventDefault();
		try {
			setLoading(true);

			let assetName = "";
			if (asset.lecture_file) {
				assetName = await handleUpload('assets', asset.lecture_file);
			}

			const data = {
				lecture_name: asset.lecture_name,
				lecture_file: assetName,
				courseId
			};

			const url = `${baseUrl}/api/courses/course/assets/${courseId}`;
			const payloadHeader = {
				headers: { Authorization: edmy_users_token },
			};

			const response = await axios.post(url, data, payloadHeader);

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

			onFetchAssets();
			router.push(`/instructor/course/assets/${courseId}`);
			
		} catch (err) {
			const message = err.response?.data?.error?.message || err.response?.data?.message || err.message || "An error occurred";
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


	const fetchVideos = async () => {
		setLoading(true);
		const payload = {
			headers: { Authorization: edmy_users_token },
		};

		const url = `${baseUrl}/api/courses/course/upload/${courseId}`;

		const response = await axios.get(url, payload);
		setVideos(response.data.videos);
		setLoading(false);
		console.log('Videos length\sds:', response.data.videos.length);

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
						/>
						<div className="form-text">
							Upload file size less than or equal to 5MB!
						</div>
					</div>
				</div>

				<div className="col-12">
					<Button
						loading={loading}
						disabled={loading || disabled}
						btnText="Upload Asset"
						btnClass="default-btn"
					/>
				</div>
			</div>
		</form>
	);
};

export default UploadAssetForm;
