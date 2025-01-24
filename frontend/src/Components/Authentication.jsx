import React, { useState } from 'react';
import axios from 'axios';

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the PIN to the server for validation
            console.log('Sending PIN:', pin); // Debugging log
            const response = await axios.post('http://localhost:5000/api/validate-pin', { pin });

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
            <h2>Enter PIN to Access Calendar</h2>
            <form onSubmit={handlePinSubmit}>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Authentication;

