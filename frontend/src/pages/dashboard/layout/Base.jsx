import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Base({ children }) {
  return (
    // Min-height 100vh holds the layout footer row strictly to the bottom area of the display window
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* Shared Master Top Navigation Panel Bar Component */}
      <Header />
      
      {/* Main Core Content Layout Structure Split Pane */}
      <div className="container-fluid flex-grow-1 px-0">
        <div className="row g-0 min-vh-100 flex-column flex-md-row">
          
          {/* Persistent Dynamic Sidebar Navigation Link Component */}
          <Sidebar />
          
          {/* Dynamic Inner Component Workspace Active Screen Pane */}
          <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 d-flex flex-column bg-body-tertiary">
            <div className="container-fluid px-0 flex-grow-1">
              {children}
            </div>
          </main>
          
        </div>
      </div>
      
      {/* Clean Bottom Copyright Label Footer Component Row */}
      <Footer />
      
    </div>
  );
}
