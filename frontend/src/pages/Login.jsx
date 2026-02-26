import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const error = useAuthStore((state) => state.error);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(formData.email, formData.password);
        setLoading(false);
        if (success) {
            navigate('/'); // Redirect to home or dashboard
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-4xl font-extrabold text-center text-primary-600 mb-8 tracking-tight">Welcome Back</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                        <input
                            name="email"
                            required
                            onChange={handleChange}
                            type="email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            name="password"
                            required
                            onChange={handleChange}
                            type="password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition duration-200 transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Sign In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">Don't have an account? <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Create one now</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
