import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToSignup = () => {
        navigate('/register');
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to the Virtual Event Platform</h1>
            <div className="space-y-4">
                <button
                    onClick={goToLogin}
                    className="w-64 py-4 text-white bg-blue-500 rounded-lg shadow-lg text-xl hover:bg-blue-600 transition duration-300"
                >
                    Log In
                </button>
                <button
                    onClick={goToSignup}
                    className="w-64 py-4 text-white bg-green-500 rounded-lg shadow-lg text-xl hover:bg-green-600 transition duration-300"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;
