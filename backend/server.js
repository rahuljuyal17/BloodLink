const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // TODO: Update to frontend URL in prod
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in .env! Backend will fail to connect.');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}


const initSocket = require('./socket');

// Socket.IO Logic
initSocket(io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

app.get('/', (req, res) => {
    res.send('BloodLink API is running...');
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
