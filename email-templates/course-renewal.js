import baseUrl from "@/utils/baseUrl";
import { transport } from "./config";
import { User } from "@/database/models";

export const reminderEmail = async (user, courseTitle, renewalDate) => {




    const data = {
        to: user.email,
        from: "Ivy Dude <info@ivydude.com>",
        subject: " Ivy Dude Account | Reminder",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Subscription Renewal Reminder</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .container h1 {
                    color: #104c6e;
                    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                    /* border-bottom: 2px solid #104c6e; */
                    padding-bottom: 10px;
                }
                .container p {
                    /* line-height: 1.6; */
                    color: #333;
                }
                .container ul, .container ol {
                    margin-left: 20px;
                }
                .container ul li, .container ol li {
                    margin: 10px 0;
                }
                .container a {
                    color: #0967d3;
                    text-decoration: none;
                }
                .container a:hover {
                    text-decoration: underline;
                }
                .wrapper{
                    width: 80%;
                    margin-left: 10%;
                }
            
            </style>
        </head>
        <body>
            <div class="container">
            <div class="wrapper"> 
                <h1>IvyDude.com</h1>
                <p>Dear ${user.first_name} ${user.last_name},</p>

                <p>We hope this email finds you well. We are writing to remind you that your access to the <strong>${courseTitle}</strong> course on the Ivy Dude Online Learning platform will expire by <strong>${renewalDate}</strong>.</p>

                <p>We value your commitment to continuous learning and would love to see you continue to benefit from our resources. To ensure uninterrupted access, we invite you to renew your subscription before the expiry date.</p>

                <p>Here are some key benefits of renewing your subscription:</p>
                <ul>
                    <li><strong>Extended Access:</strong> Continue to access all course materials, including videos, assignments, and quizzes.</li>
                    <li><strong>Updated Content:</strong> Stay up-to-date with the latest updates and new content added regularly.</li>
                    <li><strong>Community Support:</strong> Maintain your connection with our vibrant learning community and get support from fellow learners and instructors.</li>
                    <li><strong>Exclusive Resources:</strong> Access additional resources and tools designed to enhance your learning experience.</li>
                </ul>

                <p><strong>How to Renew Your Subscription:</strong></p>
                <ol>
                    <li>Log in to your Ivy Dude Online Learning account.</li>
                    <li>Navigate to the 'My Courses' section.</li>
                    <li>Click on the 'Renew Subscription' button next to the <strong>${courseTitle}</strong> course.</li>
                    <li>Follow the prompts to complete your renewal.</li>
                </ol>

                <p>Thank you for being a valued member of the Ivy Dude Online Learning community. We look forward to supporting you in your educational journey.</p>

                <p>Best regards,</p>
                <strong><p>The Ivy Dude Online Learning Team</p>
                </strong>
                <p>Contact: +91 8310 152 022</p>
                <p>Mail us: <a href="mailto:info@ivydude.com">info@ivydude.com</a></p></div>
            </div>
        </body>
        </html>



        `
    };

    try {
        await transport.sendMail(data);

    } catch (error) {
        console.error("Error sending reminder email:", error);
    } finally {
        transport.close();
    }
};