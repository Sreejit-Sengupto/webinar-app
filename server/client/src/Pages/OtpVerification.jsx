import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract user details from location.state
    const { email, name, mobile, password, confirmPassword } = location.state || {};

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        // Add logic to verify the OTP
        // If OTP is correct, redirect to the home page
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
                <h1 className="text-2xl font-bold text-center">OTP Verification</h1>
                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm">Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
