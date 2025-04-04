import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";


const CourseAsset = ({ courseId, isEnrolled,enrolmentStatus,enrollmentEndDate }) => {

    const [assets, setAssets] = useState([]);
    const { edmy_users_token } = parseCookies();
    // const router = useRouter();
    // const { id: courseId } = router.query; 
    const [loading, setLoading] = useState(true);

 
    
    console.log("courseId:", courseId);
    console.log("isenroll",isEnrolled)
    const isEnrolStatusIsActive = enrolmentStatus === "active"
	console.log("status",isEnrolStatusIsActive)


    const currentDate = new Date();
	const isCourseExpired = currentDate > new Date(enrollmentEndDate);

    console.log("fd",isCourseExpired)



    const fetchAssets = async () => {
		setLoading(true);
		const payload = {
			headers: { Authorization: edmy_users_token },
		};

		const url = `${baseUrl}/api/courses/course/assets/${courseId}`;

		const response = await axios.get(url, payload);
		setAssets(response.data.course_assets); 
		setLoading(false);
		console.log("cass res",response.data.course_assets)
	};

	useEffect(() => {
		fetchAssets();
	}, []);

    const handleView = async (assetId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/download`, {
                params: { id: assetId },
                responseType: 'blob',
                headers: {
                    Authorization: edmy_users_token,
                },
            });
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(`${url}#toolbar=0&navpanes=0&scrollbar=0`, '_blank');
        } catch (error) {
            console.error("Error viewing file:", error);
        }
    };

    return isEnrolled  && !isCourseExpired &&  isEnrolStatusIsActive  ? (

        <div className="courses-details-desc-style-two">
            <div className="row justify-content-center">
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <div className="col-lg-3 col-md-6" >
                            <div className="card text-center">
                                <i
                                    className="bx bx-file mt-2"
                                    style={{
                                        fontSize: "100px",
                                    }}
                                ></i>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {asset.lecture_name}
                                    </h5>
                                    <button
                                        className="btn btn-success mt-2"
										// className="pdf-container"
                                        onClick={() => handleView(asset.id)}
                                    >
                                        View{" "}
                                        <i className="bx bx-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No assets available</p>
                )}
            </div>
        </div>
    ):(
        <div className="text-center">
            <p className="">Access to assets is Restricted</p>
            <p className="">Buy this course to get Access</p>


        </div>
    );
};

export default CourseAsset;
