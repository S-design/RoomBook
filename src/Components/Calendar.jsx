import React, { useState } from 'react';
import './Calendar.css';
import AddBooking from './AddBooking';
import Authentication from './Authentication';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookings, setBookings] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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

    const handleDayClick = (day) => {
        if (day) {
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(clickedDate);
            setShowForm(true);
        }
    };

    if (!authenticated) {
        return <Authentication onAuthenticate={() => setAuthenticated(true)} />;
    }

    return (
        <div>
            <header>
                <h1>Book a Room</h1>
                <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={goToPreviousMonth}>Prev</button>
                <button onClick={goToNextMonth}>Next</button>
            </header>
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
                            className="calendar-day"
                            onClick={() => handleDayClick(day)}
                            style={{
                                cursor: day ? 'pointer' : 'default',
                                backgroundColor: hasBookings ? '#d1e7dd' : '#f0f0f0',
                                border: hasBookings ? '2px solid #0f5132' : '1px solid #ccc',
                            }}
                        >
                            {day}
                            {hasBookings && (
                                <div className="booking-indicator">
                                    {bookings[dateKey].length} Booking{bookings[dateKey].length > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {showForm && (
                <div className="booking-form">
                    <h3>Bookings for {selectedDate?.toDateString()}</h3>
                    <ul>
                        {bookings[selectedDate?.toDateString()]?.map((booking, index) => (
                            <li key={index}>
                                <strong>Assigned:</strong> {booking.assigned} <br />
                                <strong>Description:</strong> {booking.description}
                            </li>
                        ))}
                    </ul>
                    <AddBooking addBooking={addBooking} />
                </div>
            )}
        </div>
    );
};

export default Calendar;
