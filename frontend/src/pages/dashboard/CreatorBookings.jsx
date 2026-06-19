import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../api/Index';
import Base from './layout/Base';

function CreatorBookings() {
  const [globalBookings, setGlobalBookings] = useState([]);

  useEffect(() => {
    bookingsAPI.getUserBookings()
      .then((data) => setGlobalBookings(data))
      .catch((err) => console.error('Error loading global bookings:', err));
  }, []);

  return (
    <Base>
      {/* 💡 Fluid container wrapper for proper maximum width alignment */}
      <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
        
        {/* Title and description header block */}
        <div className="mb-4">
          <h2 className="text-dark fw-bold mb-1">🎟️ Global Booking Ledger</h2>
          <p className="text-muted mb-0">Review and audit every mentorship transaction across the marketplace.</p>
        </div>

        {/* Main white card block */}
        <div className="card shadow-sm border border-light rounded-3 p-4 bg-white">
          <h3 className="h5 fw-bold text-dark mb-4">
            All System Booking Transactions ({globalBookings.length})
          </h3>
          
          {globalBookings.length === 0 ? (
            <div className="alert alert-light text-center border p-4 text-muted">
              No bookings have been made across the platform yet.
            </div>
          ) : (
            /* 💡 Responsive flex layout: Lists cards vertically with proper gap spacing */
            <div className="d-flex flex-column gap-3">
              {globalBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="border rounded-3 p-3 bg-light d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 shadow-sm"
                >
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-1">
                      {booking.session_details?.title}
                    </h4>
                    <p className="text-secondary small mb-1">
                      🧑‍🎓 Attendee Student: <strong>{booking.user_details?.username || 'Student'}</strong> ({booking.user_details?.email})
                    </p>
                    <p className="text-muted small mb-0">
                      Host Mentor ID: {booking.session_details?.creator} | Scheduled Date: {new Date(booking.session_details?.date_time).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Status label pill badge */}
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

export default CreatorBookings;
