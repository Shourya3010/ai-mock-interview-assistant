const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('joinInterview', (interviewId) => {
    socket.join(`interview_${interviewId}`);
    console.log(`[Socket.IO] Client ${socket.id} joined room: interview_${interviewId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Make io accessible globally or attached to app
app.set('io', io);

// Start HTTP Server
server.listen(env.port, () => {
  console.log(`[Server] Running in ${env.nodeEnv} mode on port ${env.port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});
