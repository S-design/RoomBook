import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';


//loads environment variables from .env file
dotenv.config();

//for configuration
const PORT = process.env.PORT || 5000;
const PIN = process.env.PIN;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://s-design.github.io/RoomBook';

if (!PIN) {
    throw new Error('Environment variable PIN is not set!');
}


const hashedPin = bcrypt.hashSync(PIN, 10);

const app = express();


// Middleware
app.use(bodyParser.json());


app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['https://s-design.github.io', 'https://s-design.github.io/RoomBook', 'http://localhost:5173'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
}));
app.options('*', cors());
app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1);


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send('Too many attempts, please try again later.');
    },
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
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
