// lib/cors.js
import Cors from 'cors';

// CORS options
const corsOptions = {
    origin: 'https://www.ivydude.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

// Initialize CORS middleware
const corsMiddleware = Cors(corsOptions);
console.log('corsMiddleware:', corsMiddleware);
export default corsMiddleware;