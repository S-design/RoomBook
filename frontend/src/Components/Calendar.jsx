import React, { useState, useEffect } from 'react';
import './Calendar.css';
import AddBooking from './AddBooking';
import Authentication from './Authentication';
import apiClient from '../api/apiClient';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [allBookings, setAllBookings] = useState({}); // Store all bookings

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // 📌 Fetch all bookings from API
    const fetchAllBookings = async () => {
        try {
            const response = await apiClient.get('/api/bookings'); // Fetch all bookings
            const bookingsMap = {};
    
            response.data.forEach(booking => {
                bookingsMap[booking.date] = booking.bookings; // Store bookings by date
            });
    
            setAllBookings(bookingsMap);
        } catch (err) {
            console.error('❌ API Error:', err.response?.data || err.message);
            setAllBookings({});
        }
    };

    
    useEffect(() => {
        fetchAllBookings();
    }, []);

    // 📌 Fetch bookings for selected date
    useEffect(() => {
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setBookings(allBookings[formattedDate] || []);
        }
    }, [selectedDate, allBookings]);

    // 📌 Add Booking
    const addBooking = async (description, assigned) => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            await apiClient.post('/api/bookings', { date: formattedDate, description, assigned });

            fetchAllBookings(); // Refresh all bookings
        } catch (err) {
            console.error(err);
        }
    };

    // 📌 Remove Booking
    const removeBooking = async (index) => {
        try {
            const password = prompt("Enter the password to remove the booking:");
            if (password === import.meta.env.VITE_REMOVE_BOOKING_PASSWORD) {
                await apiClient.delete(`/api/bookings/${selectedDate.toISOString().split('T')[0]}/${index}`);
                fetchAllBookings(); // Refresh all bookings
            } else {
                alert("Incorrect password. Booking was not removed.");
            }
        } catch (err) {
            console.error('Error removing booking:', err);
        }
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

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

    const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

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

                {/* 📌 UPDATED CALENDAR GRID */}
                <div className="calendar">
                    {daysOfWeek.map(day => (
                        <div key={day} className="calendar-header">{day}</div>
                    ))}

                    {days.map((day, index) => {
                        if (!day) return <div key={index} className="calendar-day empty"></div>;

                        const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                        const hasBookings = allBookings[dateKey]?.length > 0;

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
                                        {allBookings[dateKey].length} Booking{allBookings[dateKey].length > 1 ? 's' : ''}
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
