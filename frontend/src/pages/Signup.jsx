import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Signup = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Donor',
        age: '',
        bloodGroup: '',
        phoneNumber: '',
        district: '',
        latitude: null,
        longitude: null
    });

    const [locationStatus, setLocationStatus] = useState('');

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation is not supported by your browser');
            return;
        }

        setLocationStatus('Locating...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('Location acquired!');
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            () => {
                setLocationStatus('Unable to retrieve your location');
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(formData);
        setLoading(false);
        if (success) {
            navigate('/'); // Redirect to home or dashboard
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-primary-600 mb-6 font-display">Create Account</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Full Name</label>
                            <input
                                name="name"
                                required
                                onChange={handleChange}
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Age</label>
                            <input
                                name="age"
                                required
                                onChange={handleChange}
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Email Address</label>
                        <input
                            name="email"
                            required
                            onChange={handleChange}
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Blood Group</label>
                            <select
                                name="bloodGroup"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            >
                                <option value="">Select</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Role</label>
                            <select
                                name="role"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            >
                                <option value="Donor">Donor</option>
                                <option value="Patient">Patient / Requester</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Phone Number</label>
                            <input
                                name="phoneNumber"
                                required
                                onChange={handleChange}
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                placeholder="1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">District</label>
                            <input
                                name="district"
                                required
                                onChange={handleChange}
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                placeholder="Central"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                        <input
                            name="password"
                            required
                            onChange={handleChange}
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
                        <button
                            type="button"
                            onClick={getLocation}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                            {formData.latitude ? 'Location Shared ✓' : '📍 Click to share live location'}
                        </button>
                        {locationStatus && <p className="text-xs mt-1 text-gray-500">{locationStatus}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline decoration-primary-300 underline-offset-4 transition-all">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
