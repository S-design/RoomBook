import React, {useState} from 'react';
import './AddBooking.css';

function AddBooking(props) {

    const [description, setDescription] = useState('');
    const [assigned, setAssigned] = useState('');

    const submitBooking = () => {
        if (description !== '' && assigned !== '') {
            props.addBooking(description, assigned);
            setDescription('');
            setAssigned('');
        }
    }

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