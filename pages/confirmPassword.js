import Navbar from '@/components/_App/Navbar'
import React, { useState } from 'react'
import baseUrl from "@/utils/baseUrl";
import axios from 'axios'; 
import { useRouter } from 'next/router';
import toast from "react-hot-toast";



const ConfirmPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [loading, setLoading] = React.useState(false);

	const router = useRouter();


	

	const handleSubmit = async (e) => {
		e.preventDefault();
        setLoading(true)
		if (password !== confirmPassword) {
			setPasswordsMatch(false);
            toast.error("Passwords do not match");
            setLoading(false)
			return;
		}
		try {
			const { token, email } = router.query;
			let payload= {reset_password_token:token, email:email, password:password}

			const url = `${baseUrl}/api/users/reset-password` 
			const response = await axios.put(url, payload); 

			if (response.status === 201) {
                toast.success("Password reset successfully!"); 
                router.push("/"); 
			} else {
				alert(response.data.message); 
			}

		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while resetting the passwords.");
		} finally {
            setLoading(false)
        }
	};


    return (
        <>
            <Navbar />
            <div className="ptb-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4">
                            <div className="login-form">
                                <h3 style={{ textAlign: "center" }}>Lost Your Password ?</h3>
                                <p style={{ textAlign: "center" }}>Create a New Password</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
											name='password' 
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(evt)=>{setPassword(evt.target.value)}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
											name='confirmpassword'
                                            type="password"
                                            className="form-control"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(evt) => {setConfirmPassword(evt.target.value)}}
                                        />
                                    </div>
                                
                                    <button
                                        className="default-btn"
                                        type="submit"
                                        loading={loading}

                                    >
                                        Reset Password
                                    </button>
                                   
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmPassword;
