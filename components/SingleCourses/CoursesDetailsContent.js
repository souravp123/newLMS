import React, { useState, useEffect } from "react";
import Link from "next/link";
import CoursesDetailsSidebar from "./CoursesDetailsSidebar";
import Testimonial from "../Course/Testimonial";
import WhatYouWillLearn from "../Course/WhatYouWillLearn";
import InstructorProfile from "../Course/InstructorProfile";
import { formatDate } from "@/utils/helper";
import TabContent from "./TabContent";

const CoursesDetailsContent = ({ user: current_user, course, isCourseExpired,currency, currencyRates}) => {
	// const [isCourseExpired, setIsCourseExpired] = useState(true); 

	const {
		
		title,
		slug,
		overview,
		testimonial,
		what_you_will_learn,
		who_is_this_course_for,
		requirements,
		is_class,
		updated_at,
		category,
		user,
		enrolments,
	} = course;


	const isCurrentUserInstructor = current_user && current_user.role === "instructor";

	// useEffect(() => {
	// 	const currentDate = new Date();
	//     const enrollmentEndDate = new Date(end_date);
	//     setIsCourseExpired(currentDate > enrollmentEndDate);
	// }, [end_date]);


	return (
		<div className="course-details-area ptb-100">
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="course-details-content">
							<h2 className="title">{title}</h2>
							<ul className="best-seller">
								{category && (
									<li>
										<Link
											href={`/category/${category.slug}`}
										>
											<a>{category.name}</a>
										</Link>
									</li>
								)}

								{isCurrentUserInstructor && (
									<li>
										<span>
											{enrolments && enrolments.length}
										</span>{" "}
										Students
									</li>
								)}


								<li>
									Last Updated{" "}
									<span>{formatDate(updated_at)}</span>
								</li>
							</ul>

							<div className="gap-mb-30"></div>

							{user && <InstructorProfile instructor={user} />}

							<div className="gap-mb-30"></div>

							<WhatYouWillLearn
								what_you_will_learn={what_you_will_learn}
							/>
							<div className="gap-mb-50"></div>

							<TabContent
								current_user={current_user}
								overview={overview}
								courseSlug={slug}
								requirements={requirements}
								instructor={user}
								who_is_this_course_for={who_is_this_course_for}
								is_class={is_class}
								isCurrentUserInstructor={isCurrentUserInstructor}

							/>
							<div className="gap-mb-50"></div>
							<Testimonial
								testimonial={testimonial}
							/>



						</div>

					</div>

					<CoursesDetailsSidebar
						isCourseExpired={isCourseExpired}
						current_user={current_user}
						course={course}
						isCurrentUserInstructor={isCurrentUserInstructor}
						currency={currency} 
						currencyRates={currencyRates}					/>
				</div>
			</div>
		</div>
	);
};

export default CoursesDetailsContent;
