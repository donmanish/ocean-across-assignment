import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../api/Index';
import Base from './layout/Base';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingsAPI.getUserBookings()
      .then((data) => setBookings(data))
      .catch((err) => console.error('Error loading bookings:', err));
  }, []);

  return (
    <Base>
      {/* Container wrapper for maximum width alignment */}
      <div className="container-fluid px-0" style={{ maxWidth: '1000px' }}>
        
        {/* Header Strings Title Section */}
        <div className="mb-4">
          <h2 className="text-dark fw-bold mb-1">👤 User Dashboard</h2>
          <p className="text-muted mb-0">Track your active programming workshop reservations.</p>
        </div>

        {/* Main white data card panel box */}
        <div className="card shadow-sm border border-light rounded-3 p-4 bg-white">
          <h3 className="h5 fw-bold text-dark mb-4">Your Confirmed Bookings</h3>
          
          {bookings.length === 0 ? (
            <p className="text-muted my-2">You haven't booked any learning slots yet.</p>
          ) : (
            /* Stacks rows vertically with gap layout utility */
            <div className="d-flex flex-column gap-3">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="border rounded-3 p-3 bg-light d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
                >
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-1">{booking.session_details?.title}</h4>
                    <p className="text-secondary small mb-0">
                      Date: {new Date(booking.session_details?.date_time).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Status label badge wrapper */}
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill small fw-bold text-uppercase">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </Base>
  );
}

export default UserDashboard;
