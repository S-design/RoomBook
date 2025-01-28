import React, { useState, useEffect } from 'react';
import './Calendar.css';
import AddBooking from './AddBooking';
import Authentication from './Authentication';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState(() => {
        const storedBookings = localStorage.getItem('bookings');
        return storedBookings ? JSON.parse(storedBookings) : {};
    });
    const [showForm, setShowForm] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }, [bookings]);

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
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
    };

    const addBooking = (description, assigned) => {
        const dateKey = selectedDate.toDateString();
        const newBooking = { description, assigned };

        setBookings(prevBookings => ({
            ...prevBookings,
            [dateKey]: [...(prevBookings[dateKey] || []), newBooking],
        }));

        setShowForm(false);
    };

    const removeBooking = (dateKey, index) => {
        const password = prompt("Enter the password to remove the booking:");
        if (password === import.meta.env.VITE_REMOVE_BOOKING_PASSWORD) {
            setBookings(prevBookings => {
                const updatedBookings = { ...prevBookings };
                if (updatedBookings[dateKey]) {
                    updatedBookings[dateKey].splice(index, 1);
                    if (updatedBookings[dateKey].length === 0) {
                        delete updatedBookings[dateKey];
                    }
                }
                return updatedBookings;
            });
        } else {
            alert("Incorrect password. Booking was not removed.");
        }
    };
    

    const handleDayClick = (day) => {
        if (day) {
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(clickedDate);
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
                <button className="Prev" onClick={goToNextMonth}>Next</button>
            </header>
            <div className="main-content">
                {/* Sidebar for Bookings */}
                <aside className="booking-sidebar">
                    <h3 className="sidebar-title">Bookings for {selectedDate?.toDateString() || 'No date selected'}</h3>
                    <ul className="b-list">
                        {selectedDate && bookings[selectedDate.toDateString()]?.length > 0 ? (
                            bookings[selectedDate.toDateString()].map((booking, index) => (
                                <li key={index} className="b-Litem">
                                    <strong>Assigned:</strong> {booking.assigned} <br />
                                    <strong>Description:</strong> {booking.description} <br />
                                    <button
                                        className="rm-b-btn"
                                        onClick={() => removeBooking(selectedDate.toDateString(), index)}
                                    >
                                        Remove
                                    </button>
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
                        const hasBookings = bookings[dateKey]?.length > 0;

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
                                    {bookings[dateKey].length} Booking{bookings[dateKey].length > 1 ? 's' : ''}
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


