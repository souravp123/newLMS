import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import Navbar from "@/components/_App/Navbar";
import Footer from "@/components/_App/Footer";

const privacyPolicy = ({ user }) => {
    return (
        <>
            <Navbar user={user} />
            <PageBanner
                pageTitle="Privacy Policy"
                homePageUrl="/"
                homePageText="Home"
                activePageText="Privacy Policy"
            />

            <div className="container mt-5 mb-5">
                <div className="content">
                    <strong><h2 style={{textAlign:"center"}}>IVYDUDE GLOBAL PRIVATE LIMITED</h2></strong>
                    
                    <h2>Privacy Policy</h2>
                    <p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information when you use our online video tutoring platform.</p>

                    <h3>Information We Collect</h3>
                    <p>We collect the following types of information:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, payment information, and any other information you provide during registration.</li>
                        <li><strong>Usage Data:</strong> Information on how you use our platform, including pages visited, videos watched, and interactions with our services.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, operating system, and other technical information related to your device and connection.</li>
                    </ul>

                    <h3>How We Use Your Information</h3>
                    <p>We use your information for the following purposes:</p>
                    <ul>
                        <li>To provide and maintain our services.</li>
                        <li>To process your transactions and manage your subscriptions.</li>
                        <li>To communicate with you, including sending updates, notifications, and support messages.</li>
                        <li>To improve our platform, including analyzing usage patterns and user feedback.</li>
                        <li>To ensure the security and integrity of our services.</li>
                    </ul>

                    <h3>How We Protect Your Information</h3>
                    <p>We implement a variety of security measures to protect your personal information, including:</p>
                    <ul>
                        <li>Encryption of sensitive data during transmission.</li>
                        <li>Regular security audits and vulnerability assessments.</li>
                        <li>Access controls to limit access to your personal information.</li>
                    </ul>

                    <h3>Sharing Your Information</h3>
                    <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except:</p>
                    <ul>
                        <li>When we have your consent to share the information.</li>
                        <li>To trusted third parties who assist us in operating our platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</li>
                        <li>When we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</li>
                    </ul>

                    <h3>Your Rights</h3>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access the personal information we hold about you.</li>
                        <li>Request correction of any inaccurate or incomplete information.</li>
                        <li>Request deletion of your personal information.</li>
                        <li>Opt-out of receiving marketing communications from us.</li>
                    </ul>

                    <h3>Changes to This Privacy Policy</h3>
                    <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.</p>

                    <h3>Contact Us</h3>
                    <p>If you have any questions about this privacy policy or our treatment of your personal information, please contact us at <strong>info@ivydude.com</strong></p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default privacyPolicy;
