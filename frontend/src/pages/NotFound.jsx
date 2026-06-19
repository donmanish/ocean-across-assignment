import React from 'react';

function NotFound() {
  return (
    // 💡 Container that centers the content vertically and horizontally on the screen
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center p-5 shadow-sm border rounded-3 bg-white max-w-md">
        
        {/* Giant red error text */}
        <h1 className="display-1 fw-bold text-danger m-0">404</h1>
        
        {/* Error heading subtitle */}
        <h2 className="h3 fw-semibold text-dark mt-2 mb-3">Oops! Page Not Found</h2>
        
        {/* Helpful text paragraph info */}
        <p className="text-muted mb-4 lead fs-6">
          The URL you requested does not exist on this marketplace server.
        </p>
        
        {/* Action Link Button back to the public catalog index layout */}
        <a 
          href="/" 
          className="btn btn-primary btn-lg fw-bold px-4 py-2 shadow-sm rounded-pill"
        >
          Go Back Home
        </a>
        
      </div>
    </div>
  );
}


export default NotFound;
