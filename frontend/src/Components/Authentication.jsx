import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import './Authentication.css';

const Authentication = ({ onAuthenticate }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Define isSubmitting state

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
            setIsSubmitting(true); // Set isSubmitting to true while processing
            const response = await apiClient.post('/api/validate-pin', { pin });

            if (response.status === 200) {
                onAuthenticate(); // Call the callback on successful authentication
                setError(''); // Clear errors if any
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false); // Reset isSubmitting regardless of success or failure
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
                    maxLength="6"
                    disabled={isSubmitting} // Disable input while submitting
                />
                <button
                    className="submit-btn"
                    type="submit"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Authentication;

