import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


//loads environment variables from .env file
dotenv.config();

//for configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const PIN = process.env.PIN;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://s-design.github.io/RoomBook';

if (!PIN) {
    throw new Error('Environment variable PIN is not set!');
}


const hashedPin = bcrypt.hashSync(PIN, 10);

const app = express();

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    bookings: [{ description: String, assigned: String }]
});

const Booking = mongoose.model('Booking', bookingSchema);

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
    methods: ['GET', 'POST', 'DELETE'],
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

// API: Get Bookings
// Fetch Bookings for a Date
app.get('/api/bookings/:date', async (req, res) => {
    try {
        const booking = await Booking.findOne({ date: req.params.date });
        if (!booking) {
            return res.status(404).json({ message: 'No bookings found.' });
        }
        res.status(200).json(booking);
    } catch (err) {
        console.error('❌ Error fetching bookings:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a Booking
app.post('/api/bookings', async (req, res) => {
    const { date, description, assigned } = req.body;
    if (!date || !description || !assigned) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const booking = await Booking.findOneAndUpdate(
            { date },
            { $push: { bookings: { description, assigned } } },
            { new: true, upsert: true }
        );
        res.status(200).json(booking);
    } catch (err) {
        console.error('❌ Error adding booking:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove a Booking
app.delete('/api/bookings/:date/:index', async (req, res) => {
    try {
        const { date, index } = req.params;
        const booking = await Booking.findOne({ date });

        if (!booking) {
            return res.status(404).json({ message: 'No bookings found.' });
        }

        if (index < 0 || index >= booking.bookings.length) {
            return res.status(400).json({ message: 'Invalid booking index.' });
        }

        booking.bookings.splice(index, 1);
        await booking.save();
        res.status(200).json({ message: 'Booking removed successfully.' });
    } catch (err) {
        console.error('❌ Error removing booking:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
