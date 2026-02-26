import { create } from 'zustand';
import axios from 'axios';

const useRequestStore = create((set, get) => ({
    myRequests: [],
    matchingRequests: { urgentRequests: [], normalRequests: [] },
    donorLocation: null,
    loading: false,
    error: null,

    setDonorLocation: (coords) => set({ donorLocation: coords }),

    createRequest: async (requestData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/requests', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                myRequests: [response.data.request, ...state.myRequests],
                loading: false
            }));
            return true;
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to create request', loading: false });
            return false;
        }
    },

    fetchMyRequests: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/requests/my-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ myRequests: response.data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch requests', loading: false });
        }
    },

    fetchMatchingRequests: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/requests/matching', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ matchingRequests: response.data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch matching requests', loading: false });
        }
    },

    acceptRequest: async (requestId) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/requests/${requestId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh matching requests after acceptance
            get().fetchMatchingRequests();
            set({ loading: false });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to accept request', loading: false });
            return false;
        }
    }
}));

export default useRequestStore;
