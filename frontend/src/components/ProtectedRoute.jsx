import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>Loading Workspace...</div>;
  }

  // 💡 Security Rule 1: If not logged in, redirect straight to the login homepage
  if (!user) {
    alert('🔐 Authentication required. Please log in first.');
    return <Navigate to="/" replace />;
  }

  // 💡 Security Rule 2: If the user's assignment role doesn't match, block access
  if (allowedRole && user.role !== allowedRole) {
    alert(`🚫 Access Denied! This workspace is restricted to users with the "${allowedRole}" role.`);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;