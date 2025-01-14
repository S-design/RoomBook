import React, { useState } from 'react';

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinSubmit = (e) => {
        e.preventDefault();
        const correctPin = '2334'; 
        if (pin === correctPin) {
            onAuthenticate();
        } else {
            setError('Invalid PIN. Please try again.');
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
