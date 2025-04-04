import React from "react";

const Features = () => {
	return (
		<div className="our-features-area bg-color-f1efee pt-4 pb-70">
			<div className="container">
				<div className="section-title">
					{/* <span className="top-title">Our Features</span> */}
					<h2>Why you choose us</h2>
				</div>

				<div className="row justify-content-center">
					<div className="col-lg-3 col-sm-6">
						<div className="single-features">
							<img
								src="/images/features/icon1.svg"
								alt="feature"
							/>
							<h3 >some text </h3>
						
						</div>
					</div>

					<div className="col-lg-3 col-sm-6">
						<div className="single-features">
							<img
								src="/images/features/icon2.svg"
								alt="feature"
							/>
							<h3>some text</h3>	
						</div>
					</div>

					<div className="col-lg-3 col-sm-6 ">
						<div className="single-features">
							<img
								src="/images/features/icon4.svg"
								alt="feature"
							/>
							<h3>some text</h3>			
						</div>
					</div>

					<div className="col-lg-3 col-sm-6">
						<div className="single-features">
							<img
								src="/images/features/icon5.svg"
								alt="feature"
							/>
							<h3>some text</h3>
						</div>
					</div>
				</div>
			</div>

			<img
				src="/images/features/feature-shape-1.svg"
				className="shape shape-1"
				alt="feature"
			/>
		</div>
	);
};

export default Features;
