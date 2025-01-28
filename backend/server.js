import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';


//loads environment variables from .env file
dotenv.config();

//for configuration
const PORT = process.env.PORT || 5000;
const PIN = process.env.PIN || '2334';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const hashedPin = bcrypt.hashSync(PIN, 10);

const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: FRONTEND_URL, // Replace with your frontend's URL during development
    methods: ['POST'], // Allow POST requests
}));
app.use(helmet());


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many attempts, please try again later.',
});
app.use('/api', limiter);

// API endpoint to validate the PIN 
app.post('/api/validate-pin', async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin || !/^\d{4,6}$/.test(pin)) {
            return res.status(400).json({ message: 'Invalid PIN format' });
        }

        const isMatch = await bcrypt.compare(pin, hashedPin);

        if (isMatch) {
            res.status(200).json({ message: 'PIN is valid' });
        } else {
            res.status(401).json({ message: 'Invalid PIN' });
        }
    } catch (err) {
        console.error('Error validating PIN:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
