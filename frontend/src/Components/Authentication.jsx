import React, { useState } from 'react';
import apiClient from '../api/apiClient'; // Use your centralized Axios instance
import './Authentication.css';

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (pin.length < 4 || pin.length > 6) {
            setError('PIN must be between 4 and 6 numeric characters.');
            return;
        }

        if (!/^\d+$/.test(pin)) {
            setError('PIN must contain only numeric characters.');
            return;
        }

        try {
            // Use apiClient for the API request
            const response = await apiClient.post('/api/validate-pin', { pin });

            if (response.status === 200) {
                onAuthenticate(); // Call the callback on successful authentication
                setError(''); // Clear errors if any
            }
        } catch (err) {
            // Handle errors gracefully
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
                    maxLength="6" // Limit the input length to avoid unnecessary errors
                    aria-lable="Enter your PIN"
                />
                <button
  className="submit-btn"
  type="submit"
  disabled={!pin || isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
            </form>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Authentication;
