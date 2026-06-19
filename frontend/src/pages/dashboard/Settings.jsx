import React, { useState, useEffect, useContext } from 'react';
import { userAPI } from '../../api/Index';
import { AuthContext } from '../../context/AuthContext';
import Base from './layout/Base';

function Settings() {
  const { user, setUser } = useContext(AuthContext);
  
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    avatar_url: user?.avatar_url || ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await userAPI.updateProfile(profileForm);
      if (data && data.user) {
        setUser(data.user);
        alert(data.message || '🎉 Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('❌ Failed to update your profile settings.');
    }
  };

  return (
    <Base>
      {/* 💡 Bootstrap max-width wrapper centered layout container */}
      <div className="container-fluid px-0" style={{ maxWidth: '600px' }}>
        
        {/* Page Header Headers Section */}
        <div className="mb-4">
          <h2 className="text-dark fw-bold mb-1">⚙️ Account Settings</h2>
          <p className="text-muted mb-0">Update your public profile details and avatar picture properties.</p>
        </div>

        {/* Form panel card box container element */}
        <div className="card shadow-sm border border-light rounded-3 bg-white p-4">
          <h3 className="h6 fw-bold text-dark mb-4">Edit Profile Settings</h3>
          
          <form onSubmit={handleProfileSubmit} className="d-flex flex-column gap-3">
            
            {/* Input field 1: Username input card row */}
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">
                Username
              </label>
              <input 
                type="text" 
                name="username" 
                value={profileForm.username} 
                onChange={handleInputChange} 
                required 
                className="form-control p-2" 
              />
            </div>
            
            {/* Input field 2: Avatar string text box row */}
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">
                Avatar Image URL
              </label>
              <input 
                type="url" 
                name="avatar_url" 
                value={profileForm.avatar_url} 
                onChange={handleInputChange} 
                placeholder="https://example.com" 
                className="form-control p-2" 
              />
            </div>
            
            {/* Form action button submit trigger item */}
            <button 
              type="submit" 
              className="btn btn-primary fw-bold p-2 mt-2 rounded-3 shadow-sm"
            >
              Save Changes
            </button>
            
          </form>
        </div>
        
      </div>
    </Base>
  );
}

export default Settings;
