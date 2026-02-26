import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';
import useRequestStore from '../store/useRequestStore';

let socket;

const useSocket = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { fetchMyRequests, fetchMatchingRequests } = useRequestStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            socket = io('http://localhost:5000');

            socket.on('connect', () => {
                console.log('Connected to socket server');
                socket.emit('join-room', user.id);
            });

            socket.on('new-emergency', (request) => {
                console.log('New Emergency notification:', request);
                // Refresh matching requests for donor
                if (user.role === 'Donor') {
                    fetchMatchingRequests();
                    // Optional: Show a toast/notification
                    alert(`New Emergency! ${request.requiredBloodGroup} needed at ${request.hospitalName}`);
                }
            });

            socket.on('request-accepted', (data) => {
                console.log('Request Accepted notification:', data);
                if (user.role === 'Patient') {
                    fetchMyRequests();
                    alert(`Donor found for your request! Status: ${data.request.status}`);
                }
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [isAuthenticated, user]);

    return socket;
};

export default useSocket;
