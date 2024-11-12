// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const fileRoutes = require('./routes/fileRoutes');
const socketHandler = require('./sockets/socketHandler');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to make io accessible in req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Use the file routes
app.use('/api/files', fileRoutes);

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socketHandler(socket, io);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

app.use(limiter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
