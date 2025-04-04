import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";

const termsConditions = ({ user }) => {
	return (
		<>
			<Navbar user={user} />
			<PageBanner
				pageTitle="Terms & Conditions"
				homePageUrl="/"
				homePageText="Home"
				activePageText="Terms & Conditions"
			/>
			<section className="ptb-100">
			<strong><h2 style={{textAlign:"center"}}>IVYDUDE GLOBAL PRIVATE LIMITED</h2></strong>

				<div className="container mt-5">
					<div className="main-content-text">

						<h3>1. Accuracy and validity of information</h3>
						<p>
						While we strive to ensure all content on our website is accurate and up-to-date, 
						we do not guarantee it is free from errors or omissions. 
						Information provided is for general educational purposes and may not be applicable to all situations.
						Users rely on this content at their own risk and should verify its accuracy independently. 
						We disclaim any warranties regarding the completeness, usefulness,
						or reliability of the information. Third-party content is not endorsed or verified by us. 
						Users should seek professional advice where necessary and understand that our materials
						are not a substitute for professional training or certification.
						</p>

						<div className="gap-20"></div>

						<h3>2. Availability</h3>
						<p>
						We strive to ensure that our online learning platform is accessible 24/7 
						to provide users with the flexibility to learn at their own pace and convenience.
						While we aim for continuous availability, there may be times when the website is
						temporarily unavailable due to scheduled maintenance, upgrades, 
						or unforeseen technical issues. We will endeavor to notify users in advance of
						any planned downtime to minimize disruption. Despite our best efforts, 
						we cannot guarantee uninterrupted access and are not liable for any interruptions
						or delays in service. Users are encouraged to download necessary materials and plan
						their study schedules accordingly. In the event of prolonged outages,
						we will work diligently to restore service as quickly as possible and provide 
						updates on our progress. Our commitment is to provide a reliable learning experience, 
						and we appreciate your understanding and patience during any interruptions.
						</p>
						

						<div className="gap-20"></div>

						<h3>3. Third party websites</h3>
						<p>
						Our website may contain links to third-party websites or services that are not owned
						or controlled by us. These links are provided solely for your convenience and do not 
						imply any endorsement or association with the operators of such websites. 
						We do not have control over, and assume no responsibility for, the content, privacy policies, 
						or practices of any third-party websites. By accessing these links, you acknowledge and agree 
						that we are not responsible or liable, directly or indirectly, for any damage or loss caused or 
						alleged to be caused by or in connection with the use of or reliance on any such content, 
						goods, or services available on or through any such websites. We recommend that you review 
						the terms and conditions and privacy policies of any third-party websites you visit. 
						Your use of third-party websites is at your own risk.
						</p>
						
						<div className="gap-20"></div>

						<h3>4. Copyright and intellectual property</h3>
						<p>
						Copyright is a legal protection granted to the creators of original works, 
						including literary, artistic, musical, and other intellectual properties. 
						It gives the creator exclusive rights to use, distribute, reproduce, and display 
						their work, typically for a specified period. Copyright ensures that creators can 
						control and receive compensation for their creations, encouraging the production of 
						new works. Unauthorized use or reproduction of copyrighted material without permission 
						from the copyright holder is prohibited and can lead to legal consequences. 
						Copyright does not protect ideas, concepts, or facts but rather the specific 
						expression of those ideas in tangible form.
						</p>
						{/* <ul>
							<li>
								<i className="ri-check-line"></i>
								Quisque velit nisi, pretium ut lacinia in,
								elementum id enim.
							</li>
							<li>
								<i className="ri-check-line"></i>
								Proin eget tortor risus consectetur adipiscing
								elit.
							</li>
							<li>
								<i className="ri-check-line"></i>
								Curabitur aliquet quam id dui posuere blandit.
							</li>
						</ul> */}

						<div className="gap-20"></div>

						<h3>6. Termination of contract</h3>
						<p>
						The contract between users and the online learning website may be terminated 
						under specific conditions. Users have the right to terminate their accounts at 
						any time by following the procedures outlined on the website. Upon termination, 
						users will lose access to all courses and materials, and any outstanding fees will 
						remain payable. The website reserves the right to terminate or suspend user accounts 
						without prior notice if there is a violation of the terms and conditions, including 
						but not limited to, fraudulent activities, misuse of content, or disruptive behavior. 
						In the event of termination by the website, users will be notified of the reasons for 
						termination and any applicable refund policies. Both parties agree that termination of 
						the contract does not waive any rights or obligations accrued prior to the termination. 
						The terms governing intellectual property, confidentiality, and limitation of liability 
						shall survive the termination of the contract.
						</p>
						

						<div className="gap-20"></div>

						<h3>7. Limitation of liability</h3>
						<p>
						We are committed to providing a high-quality learning experience, 
						but we acknowledge that issues may arise. Therefore, our liability is limited 
						to the fullest extent permitted by law. Under no circumstances shall we, 
						our affiliates, partners, or instructors be liable for any direct, indirect, 
						incidental, consequential, special, or exemplary damages arising out of or in 
						connection with your use of the website, including but not limited to any loss of 
						profits, data, or other intangible losses. This limitation applies regardless of the 
						legal theory on which a claim is based, whether in contract, tort, negligence, 
						strict liability, or otherwise, even if we have been advised of the possibility 
						of such damages. In jurisdictions that do not allow the exclusion or limitation 
						of liability for consequential or incidental damages, our liability is limited to 
						the maximum extent permitted by law. Your sole remedy for dissatisfaction with the 
						website is to stop using it.
						</p>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default termsConditions;
