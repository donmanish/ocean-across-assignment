import React from 'react'


import './App.css'
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import UserDashboard from './pages/dashboard/UserDashboard.jsx';
import CreatorDashboard from './pages/dashboard/CreatorDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreatorBookings from './pages/dashboard/CreatorBookings.jsx';
import Settings from './pages/dashboard/Settings.jsx';

function App() {


  return (
    <>
      <AuthProvider>
        <Routes>
          {/* 1. Public Page: Open to everyone */}
          <Route path="/" element={<Home />} />

          {/* 2. Secured Student Dashboard: Only accounts with 'user' role can enter */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRole="user">
              <Settings />
            </ProtectedRoute>
          } />

          {/* 3. Secured Creator Dashboard: Only accounts with 'creator' role can enter */}
          <Route path="/creator-dashboard" element={
            <ProtectedRoute allowedRole="creator">
              <CreatorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/creator-bookings" element={
            <ProtectedRoute allowedRole="creator">
              <CreatorBookings />
            </ProtectedRoute>
          } />

          {/* 4. Fallback 404 Error handler */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
