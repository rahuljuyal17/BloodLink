import React, { useState } from 'react';
import useRequestStore from '../store/useRequestStore';

const RequestModal = ({ isOpen, onClose }) => {
    const createRequest = useRequestStore((state) => state.createRequest);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        requiredBloodGroup: '',
        urgency: 'Normal',
        hospitalName: '',
        reason: '',
        district: '',
        latitude: null,
        longitude: null
    });

    const [locationStatus, setLocationStatus] = useState('');

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation not supported');
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
            () => setLocationStatus('Permission denied')
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.latitude || !formData.longitude) {
            alert('Please share your location first');
            return;
        }
        setLoading(true);
        const success = await createRequest(formData);
        setLoading(false);
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
                <div className="bg-primary-600 px-8 py-6 text-white relative">
                    <h2 className="text-2xl font-black tracking-tight">Post Blood Request</h2>
                    <p className="text-primary-100 text-sm font-medium">Alert nearby donors immediately.</p>
                    <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Blood Group</label>
                            <select
                                name="requiredBloodGroup"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold"
                            >
                                <option value="">Select</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Urgency</label>
                            <select
                                name="urgency"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Urgent">Urgent (SOS)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hospital Name</label>
                        <input
                            name="hospitalName"
                            placeholder="e.g. City General Hospital"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">District</label>
                            <input
                                name="district"
                                placeholder="District Name"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason</label>
                            <input
                                name="reason"
                                placeholder="Surgery, Accident, etc."
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            type="button"
                            onClick={getLocation}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.latitude ? 'bg-green-100 text-green-600' : 'bg-primary-50 text-primary-600 border border-primary-100'}`}
                        >
                            {formData.latitude ? 'Location Set ✓' : '📍 Share Location'}
                        </button>
                        <span className="text-xs text-gray-500 font-medium">{locationStatus || 'Required for urgent matching'}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-200 transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Posting Request...' : 'Alert Nearby Donors'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
