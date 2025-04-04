import React, { useState } from 'react';
import toast from "react-hot-toast";
import OtpInput from 'react-otp-input';
import baseUrl from '@/utils/baseUrl';
import axios from 'axios';


const ConfirmOTP = ({ onOTPConfirmSuccess, email }) => {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleInputChange = (otp) => {
        setOtp(otp);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                otp: otp, email: email
            };
            const url = `${baseUrl}/api/users/confirm-otp`;
            const response = await axios.put(url, payload);
            if (response.status === 201) {
                toast.success("OTP Verified successfully, Please Login to continue.", {
                    style: {
                        border: "1px solid #4BB543",
                        padding: "16px",
                        color: "#4BB543",
                    },
                    iconTheme: {
                        primary: "#4BB543",
                        secondary: "#FFFAEE",
                    },
                });
                onOTPConfirmSuccess();
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error confirming OTP:', error);
            setErrorMessage(error?.response?.data?.message ?? 'An error occurred while confirming OTP.');
        }
    }




    return (
        <div>
            <h2>Confirm OTP</h2>
            <form onSubmit={handleSubmit}>
                {/* <h6>We will send One Time Password at registered Email</h6> */}
                <p>Check your Email for OTP</p>

                <div className='form-group'>
                    <label htmlFor="otp">Enter OTP:</label>
                    <div className='form-otp'>
                        <OtpInput
                            className="form-control"
                            value={otp}
                            onChange={handleInputChange}
                            numInputs={6}
                            // renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                        />
                    </div>

                </div>
                {errorMessage && <p style={{ color: "red" }} className="error-message">{errorMessage}</p>}

                <div>
                    <button className='default-btn' type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default ConfirmOTP;
