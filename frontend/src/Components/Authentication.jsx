import React, { useState } from 'react';
import axios from 'axios';
import './Authentication.css';

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (pin.length < 4 || pin.length > 6) {
            setError('PIN must be between 4 and 6 characters.');
            return;
        }

        if (!/^\d+$/.test(pin)) {
            setError('PIN must contain only numeric characters.');
            return;
        }

        try {
            const response = await axios.post('https://roombook-v6rk.onrender.com/api/validate-pin', { pin });
            if (response.status === 200) {
                onAuthenticate(); // Proceed with authentication
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="authentication">
            <h2 className="access-title">Enter PIN to Access Calendar</h2>
            <form onSubmit={handlePinSubmit}>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                />
                <button className="submit-btn" type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Authentication;
