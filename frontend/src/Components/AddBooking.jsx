import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './AddBooking.css';

function AddBooking(props) {
    const [description, setDescription] = useState('');
    const [assigned, setAssigned] = useState('');

    const submitBooking = () => {
        const trimmedDescription = description.trim();
        const trimmedAssigned = assigned.trim();

        if (trimmedDescription === '' || trimmedAssigned === '') {
            alert('Both fields are required.');
            return;
        }

        if (trimmedDescription.length > 500) {
            alert('Description must be under 500 characters.');
            return;
        }

        if (!/^[a-zA-Z0-9\s]+$/.test(trimmedAssigned)) {
            alert('Assigned name must only contain alphanumeric characters.');
            return;
        }

        const sanitizedDescription = DOMPurify.sanitize(trimmedDescription);
        const sanitizedAssigned = DOMPurify.sanitize(trimmedAssigned);

        props.addBooking(sanitizedDescription, sanitizedAssigned);
        setDescription('');
        setAssigned('');
    };

    return (
        <div className="add-booking-form">
            <form>
                <div className="mb-3">
                    <label className="form-label">Assigned</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        onChange={(e) => setAssigned(e.target.value)}
                        value={assigned}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    ></textarea>
                </div>
                <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={submitBooking}
                >
                    Add Booking
                </button>
            </form>
        </div>
    );
}

export default AddBooking;
