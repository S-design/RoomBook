import React, { useState, useEffect } from 'react';
import './Calendar.css';
import AddBooking from './AddBooking';
import Authentication from './Authentication';
import apiClient from '../api/apiClient';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        if (selectedDate) fetchBookings(selectedDate.toDateString());
    }, [selectedDate]);

    const fetchBookings = async (date) => {
        try {
            const response = await apiClient.get(`/api/bookings/${date}`);
            setBookings(response.data?.bookings || []);
        } catch (err) {
            console.error(err);
            setBookings([]); // Ensure state resets on failure
        }
    };
    

    const addBooking = async (description, assigned) => {
        try {
            const response = await apiClient.post('/api/bookings', {
                date: selectedDate.toDateString(), // Ensure correct date is sent
                description,
                assigned,
            });
            setBookings(response.data.bookings);
        } catch (err) {
            console.error(err);
        }
    };
    

    const removeBooking = async (index) => {
        try {
            const password = prompt("Enter the password to remove the booking:");
            if (password === import.meta.env.VITE_REMOVE_BOOKING_PASSWORD) {
                await apiClient.delete(`/api/bookings/${selectedDate.toDateString()}/${index}`);
                setBookings(prev => prev.filter((_, i) => i !== index)); // Remove from state
            } else {
                alert("Incorrect password. Booking was not removed.");
            }
        } catch (err) {
            console.error('Error removing booking:', err);
        }
    };
    

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendarDays = () => {
        const days = [];
        const numDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        for (let day = 1; day <= numDays; day++) {
            days.push(day);
        }

        return days;
    };

    const days = generateCalendarDays();

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        }
    };

    if (!authenticated) {
        return <Authentication onAuthenticate={() => setAuthenticated(true)} />;
    }

    return (
        <div className="app-container">
            <header>
                <h1 className="title">Book a Room</h1>
                <h2 className="sub-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button className="Prev" onClick={goToPreviousMonth}>Prev</button>
                <button className="Next" onClick={goToNextMonth}>Next</button>
            </header>
            <div className="main-content">
                {/* Sidebar for Bookings */}
                <aside className="booking-sidebar">
                    <h3 className="sidebar-title">Bookings for {selectedDate?.toDateString() || 'No date selected'}</h3>
                    <ul className="b-list">
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <li key={index} className="b-Litem">
                                    <strong>Assigned:</strong> {booking.assigned} <br />
                                    <strong>Description:</strong> {booking.description} <br />
                                    <button className="rm-b-btn" onClick={() => removeBooking(index)}>Remove</button>
                                </li>
                            ))
                        ) : (
                            <p>No bookings for this date.</p>
                        )}
                    </ul>
                    {selectedDate && <AddBooking addBooking={addBooking} />}
                </aside>

                {/* Calendar Grid */}
                <div className="calendar">
                    {daysOfWeek.map(day => (
                        <div key={day} className="calendar-header">{day}</div>
                    ))}
                    {days.map((day, index) => {
                        const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)?.toDateString();
                        const hasBookings = bookings.length > 0;


                        return (
                            <div
                                key={index}
                                className={`calendar-day ${hasBookings ? 'has-bookings' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day}
                                <hr className="day-separator" />
                                {hasBookings && (
                                    <div className="booking-indicator">
                                        {bookings.length} Booking{bookings.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Calendar;


