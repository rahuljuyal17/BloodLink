import React from 'react';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-600">BloodLink</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Hello, {user?.name} ({user?.role})</span>
                    <button
                        onClick={logout}
                        className="text-sm text-gray-500 hover:text-primary-600 font-semibold transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats / Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-red-600">{user?.bloodGroup}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Your Blood Group</h3>
                        <p className="text-gray-500 text-sm">{user?.role === 'Donor' ? 'Available to donate' : 'Requester'}</p>
                    </div>

                    {/* Action Column (Changes based on Role) */}
                    <div className="md:col-span-2 space-y-6">
                        {user?.role === 'Patient' ? (
                            <div className="bg-primary-600 p-8 rounded-2xl shadow-lg text-white">
                                <h2 className="text-2xl font-bold mb-2">Need Blood Urgently?</h2>
                                <p className="text-primary-100 mb-6 font-medium">Create an emergency request to notify compatible donors within 5km instantly.</p>
                                <button className="bg-white text-primary-600 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-50 transition-all transform active:scale-95">
                                    Create Emergency Request (SOS)
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-600 p-8 rounded-2xl shadow-lg text-white">
                                <h2 className="text-2xl font-bold mb-2">Ready to Save Lives?</h2>
                                <p className="text-green-100 mb-6 font-medium">Your status is currently set to AVAILABLE. We will notify you of nearby emergencies.</p>
                                <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-50 transition-all transform active:scale-95">
                                    Toggle Availability
                                </button>
                            </div>
                        )}

                        {/* Recent Activity / Requests Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800">Recent Activity</h3>
                            </div>
                            <div className="p-12 text-center">
                                <div className="mb-4 inline-block p-4 bg-gray-50 rounded-full">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-400 font-medium">No recent requests or donations found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
