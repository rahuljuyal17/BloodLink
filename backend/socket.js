// const socketMiddleware = require('./middleware');

const initSocket = (io) => {
    // Use middleware to attach user to socket if needed
    // io.use(socketMiddleware);

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Join a personal room (useful for sending direct matches to a donor)
        socket.on('join-room', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        // Emitted by patient when looking for donors
        // In actual implementation, the REST API might emit this to the donor's room directly
        socket.on('emergency-request', (data) => {
            console.log('Emergency Request Received:', data);
            // Logic to find nearby donors and emit to them
            socket.broadcast.emit('new-emergency', data);
        });

        // Emitted continuously by the accepted donor
        socket.on('update-location', (data) => {
            const { patientId, location } = data;
            // Emit the new location only to the patient's room
            io.to(patientId).emit('donor-location-update', location);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = initSocket;
