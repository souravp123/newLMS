import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";

const refundPolicy = ({ user }) => {
    return (
        <>
            <Navbar user={user} />
            <PageBanner
                pageTitle="Refund Policy"
                homePageUrl="/"
                homePageText="Home"
                activePageText="Refund Policy"
            />

            <div className="container mt-5 mb-5">
                <div className="content">
                <strong><h2 style={{textAlign:"center"}}>IVYDUDE GLOBAL PRIVATE LIMITED</h2></strong>
                
                    <h2>Refund Policy</h2>
                    <p>Thank you for using our online learning platform. If you are not entirely satisfied with your purchase, we're here to help.</p>

                    <h3>Eligibility for Refunds</h3>
                    <p>We offer refunds under the following conditions:</p>
                    <ul>
                        <li>Courses purchased within the last 7 days and less than 25% of the course content has been accessed.</li>
                        <li>Subscriptions canceled within 48 hours of the initial purchase.</li>
                        <li>Technical issues with the content that cannot be resolved.</li>
                    </ul>

                    <h3>Non-Refundable Items</h3>
                    <p>Certain purchases are non-refundable, including:</p>
                    <ul>
                        <li>Courses where more than 25% of the content has been accessed.</li>
                        <li>Downloadable resources and digital content.</li>
                        <li>Monthly or annual subscriptions after 48 hours of the initial purchase.</li>
                    </ul>

                    <h3>Refund Process</h3>
                    <p>To initiate a refund, please follow these steps:</p>
                    <ol>
                        <li> <span style={{ textDecoration: "underline" }}><a href="tel:+91-831-015-2022">Contact</a></span> our support team with your order number and the reason for the refund request.</li>
                        <li>Our team will review your request and notify you of the refund status within 5 business days.</li>
                    </ol>

                    <h3>Refund Timeframe</h3>
                    <p>If your refund is approved, we will process it to your original method of payment. You will receive the credit within 5 - 7 days, depending on your card issuer's policies.</p>

                    <h3>Contact Us</h3>
                    <p>If you have any questions about our refund policy, please contact us at <strong>info@ivydude.com</strong></p>
                </div>
            </div>

            <Footer />
        </>

    )

}

export default refundPolicy;
