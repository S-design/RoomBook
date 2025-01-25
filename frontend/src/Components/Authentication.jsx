import React, { useState } from 'react';
import axios from 'axios';
import './Authentication.css'

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the PIN to the server for validation
            console.log('Sending PIN:', pin); // Debugging log
            const response = await axios.post('https://roombook-v6rk.onrender.com/api/validate-pin', { pin });
            //http://localhost:5000

            if (response.status === 200) {
                console.log('PIN validated successfully'); // Debugging log
                onAuthenticate(); // Proceed with authentication
            }
        } catch (err) {
            console.error('Error validating PIN:', err); // Debugging log
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

