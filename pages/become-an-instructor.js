import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";
import RegisterForm from "@/components/BecomeAInstructor/RegisterForm";

const becomeInstructor = ({ user }) => {
	return (
		<>
			<Navbar user={user} />
			<PageBanner
				pageTitle="Become Instractor"
				homePageUrl="/"
				homePageText="Home"
				activePageText="Join Ivy Dude as an instructor and shape futures with your expertise!"
			/>
			<RegisterForm user={user} />
			<Footer />
		</>
	);
};

export default becomeInstructor;
