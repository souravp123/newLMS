import React from "react";
import Link from "next/link";
import { IoIosMail } from "react-icons/io";
import { IoMdCall } from "react-icons/io";


function BookLiveTutoring() {
	return ( 
		<div className="business-area pb-100 pt-5">
			<div className="container">
				<div className="business-bg rounded  ptb-100">
					<div className="row align-items-center">
						<div className="col-lg-7">
							<div className="business-img">
								<img
									src="/images/business-img.png"
									alt="business"
								/>
							</div>
						</div>

						<div className="col-lg-5">
							<div className="business-content">
								<h2>
									Get all your doubts cleared through a live tutoring session
									for only **** per hour
								</h2>
								<p>
									Contact <span style={{ color: 'black' }}>"contact"</span> to discuss details and schedule your session.
								</p>
								<Link href="tel:" >
									<section id="style_four">
										<div class="inner_box">
											<button style={{backgroundColor:"#91d292"}}>
												<span id="like"><i><IoMdCall /></i></span>
												<a href="">Call Now : 9999 999 999</a>

											</button>
										</div>

									</section>
								</Link>
								&nbsp;
								<Link href="mailto:">
									<section id="style_four">
										<div class="inner_box">
											<button style={{backgroundColor:"#91d292"}}>
												<span id="comment"><i><IoIosMail /></i></span>
												<a href="">Mail To : example@gmail.com</a>
											</button>
										</div>

									</section>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BookLiveTutoring;
