import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

function Sidebar() {
  const { user } = useContext(AuthContext);
  const currentPath = window.location.pathname;

  // 💡 Function to apply active color classes based on the browser address link path
  const getClassNames = (path) => {
    const baseClasses = "nav-link fw-bold px-3 py-2 rounded-3 text-start mb-1 mb-md-2";
    return currentPath === path 
      ? `${baseClasses} bg-primary text-white active` 
      : `${baseClasses} text-secondary bg-transparent hover-bg-light`;
  };

  return (
    // 💡 RESPONSIVE CONTAINER: Works as a standard column layout panel on desktops, 
    // but switches to a horizontal navigation row list on smaller mobile screens.
    <aside className="col-12 col-md-3 col-lg-2 bg-white border-end p-3 box-sizing-border">
      <span className="text-muted fw-bold small text-uppercase tracking-wider d-none d-md-block mb-3">
        Dashboard Menu
      </span>
      
      <div className="nav nav-pills flex-row flex-md-column w-100 gap-1 mt-2 mt-md-0">
        {user?.role === 'user' && (
          <>
            <a href="/dashboard" className={getClassNames('/dashboard')}>
              👤 User Dashboard
            </a>
            <a href="/settings" className={getClassNames('/settings')}>
              ⚙️ Account Settings
            </a>
          </>
        )}

        {user?.role === 'creator' && (
          <>
            <a href="/creator-dashboard" className={getClassNames('/creator-dashboard')}>
              📝 Manage Sessions
            </a>
            <a href="/creator-bookings" className={getClassNames('/creator-bookings')}>
              🎟️ View Bookings
            </a>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
