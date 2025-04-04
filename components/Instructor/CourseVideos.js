import baseUrl from "@/utils/baseUrl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import Backdrop from "../Backdrop";
import Player from "../Learning/Player";


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


const CourseVideos = ({ id: videoId, title, thumb, video, slug, onDelete }) => {
	const [image, setImage] = useState('');
	const [preview, setPreview] = useState('');
	const [toggler, setToggler] = useState(false);
	const { edmy_users_token } = parseCookies();

	useEffect(() => {
		const fetchImage = async () => {
			if (thumb) {
				const url = `${baseUrl}/api/get-image?imageName=${thumb}`;

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
	}, []);

	const handlePreviewClick = () => {
		setPreview(video);
		setToggler(!toggler);
	};

	return (
		<div className="col-lg-3 col-md-6">
			<div className="card" style={{ width: "18rem" }}>

				{image ? (
					<Image
						src={image}
						className="card-img-top"
						alt={title}
						width={250}
						height={250}
					/>
				) : (
					<div className="card-img-top d-flex align-items-center justify-content-center" style={{ height: '250px', background: 'linear-gradient(45deg, #172f57, #4266a1)' }}>
						<h5 className="text-white">{title}</h5>
					</div>
				)}


				<div className="card-body">
					<h5 className="card-title">{title}</h5>
					<button
						onClick={handlePreviewClick}
						className="btn btn-info"
					>
						Play
					</button>
					&nbsp;
					<button
						onClick={() => onDelete(videoId)}
						className="btn btn-danger"
					>
						Delete
					</button>
				</div>
			</div>

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
				</Backdrop>
			}
		</div>
	);
};

export default CourseVideos;
