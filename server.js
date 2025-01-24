import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL during development
    methods: ['POST'], // Allow POST requests
}));

// Store a hashed PIN securely on the server
const hashedPin = bcrypt.hashSync('2334', 10);

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many attempts, please try again later.',
});

// API endpoint to validate the PIN (with rate limiting applied)
app.post('/api/validate-pin', limiter, async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        return res.status(400).json({ message: 'PIN is required' });
    }

    const isMatch = await bcrypt.compare(pin, hashedPin);

    if (isMatch) {
        res.status(200).json({ message: 'PIN is valid' });
    } else {
        res.status(401).json({ message: 'Invalid PIN' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
