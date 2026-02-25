import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-primary-600 mb-6">Welcome Back</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
