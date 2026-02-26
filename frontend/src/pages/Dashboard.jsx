import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRequestStore from '../store/useRequestStore';
import RequestModal from '../components/RequestModal';
import LiveMap from '../components/LiveMap';
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { myRequests, matchingRequests, donorLocation, fetchMyRequests, fetchMatchingRequests, acceptRequest } = useRequestStore();
    const { emitLocation } = useSocket();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        if (user?.role === 'Patient') {
            fetchMyRequests();
        } else if (user?.role === 'Donor') {
            fetchMatchingRequests();
        }
    }, [user]);

    // Donor Location Tracking Logic
    useEffect(() => {
        let watchId;
        if (isSharing && user?.role === 'Donor') {
            const acceptedRequest = matchingRequests.urgentRequests?.find(r => r.status === 'Accepted' && r.matchedDonor === user.id)
                || matchingRequests.normalRequests?.find(r => r.status === 'Accepted' && r.matchedDonor === user.id);

            if (acceptedRequest) {
                watchId = navigator.geolocation.watchPosition(
                    (pos) => {
                        const coords = [pos.coords.latitude, pos.coords.longitude];
                        emitLocation(acceptedRequest.patientId, coords);
                    },
                    (err) => console.error(err),
                    { enableHighAccuracy: true }
                );
            } else {
                alert("Please accept a request first to start tracking.");
                setIsSharing(false);
            }
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isSharing]);

    const handleAccept = async (id) => {
        if (window.confirm('Are you sure you want to accept this request?')) {
            await acceptRequest(id);
        }
    };

    const acceptedRequestForPatient = myRequests.find(r => r.status === 'Accepted');

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow-xl shadow-gray-100 border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">B</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter">BloodLink</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-900 leading-tight">{user?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{user?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 p-2 rounded-xl transition-all border border-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Profile Sidebar */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 inset-x-0 h-2 bg-primary-600" />
                            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                <span className="text-4xl font-black text-primary-600">{user?.bloodGroup}</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">{user?.bloodGroup} Blood Group</h3>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{user?.role}</p>

                            <div className="mt-8 pt-8 border-t border-gray-50 w-full flex flex-col items-center gap-1">
                                <span className="text-sm font-bold text-gray-900">{user?.district}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">District Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Dashboard Content */}
                    <div className="lg:col-span-9 space-y-10">
                        {/* Map Section - Only visible during active donation */}
                        {(acceptedRequestForPatient || isSharing) && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                                    Live Tracking
                                </h3>
                                <LiveMap
                                    donorLocation={user?.role === 'Patient' ? donorLocation : null}
                                    hospitalLocation={acceptedRequestForPatient ? [acceptedRequestForPatient.location.coordinates[1], acceptedRequestForPatient.location.coordinates[0]] : null}
                                    hospitalName={acceptedRequestForPatient?.hospitalName || "Donation Center"}
                                />
                                {user?.role === 'Patient' && (
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-600">
                                        Donor is on the way. Please stay reachable at your phone number.
                                    </div>
                                )}
                            </div>
                        )}

                        {user?.role === 'Patient' ? (
                            <div className="bg-primary-600 p-10 rounded-[32px] shadow-2xl shadow-primary-200 relative overflow-hidden group">
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                                <div className="relative z-10 max-w-lg">
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-none">Need Blood Urgently?</h2>
                                    <p className="text-primary-100 mb-8 font-medium text-lg leading-relaxed opacity-90">Post an emergency request. We'll automatically find and notify local donors within a 5km radius for you.</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-white text-primary-600 font-black py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform active:scale-95 text-lg"
                                    >
                                        Create SOS Request
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-600 p-10 rounded-[32px] shadow-2xl shadow-green-200 relative overflow-hidden group">
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                                <div className="relative z-10 max-w-lg">
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-none">Ready to Save a Life?</h2>
                                    <p className="text-green-100 mb-8 font-medium text-lg leading-relaxed opacity-90">
                                        {isSharing ? "You are currently sharing your live location with the patient." : "Accept a request and start tracking to help the patient know you're coming."}
                                    </p>
                                    <button
                                        onClick={() => setIsSharing(!isSharing)}
                                        className={`${isSharing ? 'bg-red-500' : 'bg-white'} ${isSharing ? 'text-white' : 'text-green-600'} font-black py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform active:scale-95 text-lg`}
                                    >
                                        {isSharing ? 'Stop Tracking' : 'Start Live Tracking'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Content Feed Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                {user?.role === 'Patient' ? 'My Active Requests' : 'Incoming Emergencies'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user?.role === 'Patient' ? (
                                    myRequests.length > 0 ? (
                                        myRequests.map((req) => (
                                            <div key={req._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.urgency === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {req.urgency}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">#{req._id.slice(-6)}</span>
                                                </div>
                                                <h4 className="text-lg font-black text-gray-900 mb-1">{req.hospitalName}</h4>
                                                <p className="text-gray-500 text-sm mb-4">{req.reason}</p>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                    <span className="bg-gray-50 px-3 py-1 rounded-lg text-primary-600 font-black">{req.requiredBloodGroup}</span>
                                                    <span className="text-xs font-bold text-gray-400">{req.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="md:col-span-2 py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-bold">No active requests found.</p>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        {matchingRequests.urgentRequests?.map(req => (
                                            <div key={req._id} className={`p-6 rounded-3xl border ${req.status === 'Accepted' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className={`${req.status === 'Accepted' ? 'bg-green-600' : 'bg-red-600'} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter`}>
                                                        {req.status === 'Accepted' ? 'Assigned to You' : 'Extreme Urgency'}
                                                    </span>
                                                    <span className="text-gray-900 font-black text-xl">{req.requiredBloodGroup}</span>
                                                </div>
                                                <h4 className="font-black text-gray-900 text-lg mb-1">{req.hospitalName}</h4>
                                                <p className="text-gray-500 text-sm mb-6">{req.reason}</p>
                                                {req.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleAccept(req._id)}
                                                        className="w-full bg-red-600 text-white font-black py-3 rounded-2xl hover:bg-red-700 transition-all"
                                                    >
                                                        Accept & Help
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {matchingRequests.normalRequests?.map(req => (
                                            <div key={req._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Normal Request</span>
                                                    <span className="text-primary-600 font-black text-xl">{req.requiredBloodGroup}</span>
                                                </div>
                                                <h4 className="font-black text-gray-900 text-lg mb-1">{req.hospitalName}</h4>
                                                <p className="text-gray-500 text-sm mb-6">{req.reason}</p>
                                                <button
                                                    onClick={() => handleAccept(req._id)}
                                                    className="w-full border-2 border-primary-600 text-primary-600 font-black py-3 rounded-2xl hover:bg-primary-50 transition-all"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ))}
                                        {matchingRequests.urgentRequests?.length === 0 && matchingRequests.normalRequests?.length === 0 && (
                                            <div className="md:col-span-2 py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                                                <p className="text-gray-400 font-bold">No matching emergencies in your area.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Dashboard;

