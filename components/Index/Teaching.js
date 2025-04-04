import React from "react";
import Link from "next/link";

const Teaching = ({user}) => {
	const isCurrentUserInstructor = user && user.role === "instructor";

	return (
		<div className="teaching-area ptb-50">
			<div className="container">
				<div className="row align-items-center ">
					<div className="col-lg-6">
						<div className="teaching-content mr-15">
							<h2>
								Become An Instructor Today & Start Earning Limitless Today
							</h2>
							<p>
								We provide the tools and
								skills to teach what you love. And you can also
								achieve your goal with us.
							</p>

							<div className="row">
								<div className="col-lg-6 col-sm-6">
									<ul>
										<li className="d-flex align-items-center">
											<img
												src="/images/icon/teaching-icon-1.svg"
												alt="teaching"
											/>
											<h3>Expert Instruction</h3>
										</li>
										<li className="d-flex align-items-center">
											<img
												src="/images/icon/teaching-icon-3.svg"
												alt="teaching"
											/>
											<h3>Remote Learning</h3>
										</li>
									</ul>
								</div>

								<div className="col-lg-6 col-sm-6">
									<ul className="teaching-list">
										<li className="d-flex align-items-center">
											<img
												src="/images/icon/teaching-icon-2.svg"
												alt="teaching"
											/>
											<h3>Lifetime Access</h3>
										</li>
										<li className="d-flex align-items-center">
											<img
												src="/images/icon/teaching-icon-4.svg"
												alt="teaching"
											/>
											<h3>Self Development</h3>
										</li>
									</ul>
								</div>
							</div>
							{!isCurrentUserInstructor && (
							<Link href="/become-an-instructor">
								<a className="default-btn">
									Become An Instructor
								</a>
							</Link>
							)}
						</div>
					</div>

					<div className="col-lg-6">
						<div className="teaching-img ml-15">
							<img
								src="/images/teaching-img-shape.png"
								className="teaching-img-shape"
								alt="teaching"
							/>
							<img
								src="/images/teaching-img-4.png"
								alt="teaching"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Teaching;
