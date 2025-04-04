import React from "react";

const Testimonial = ({ testimonial }) => {
	return (
		<div className="this-course-content">
			<h3>Testimonials</h3>
			<div
				dangerouslySetInnerHTML={{ __html: testimonial }}
			></div>
		</div>
	);
};

export default Testimonial;
