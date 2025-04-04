import React from "react";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import PageNavigation from "@/components/Instructor/PageNavigation";
import { useRouter } from "next/router";
import BatchUpload from "@/components/Instructor/BatchUpload";

const Index = ({ user }) => {
	const router = useRouter();
	const { id: courseId } = router.query;
	return (
		<>
			<Navbar user={user} />
 
			<div className="ptb-100">
				<div className="container">
					<PageNavigation
						courseId={courseId}
						activeClassname="wholeupload"
					/>

					<div className="create-course-form">
						<BatchUpload courseId={courseId} />
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Index;
