import React, { useState, useEffect } from 'react';
import { sessionsAPI, userAPI } from '../../api/Index';
import Base from './layout/Base';

function CreatorDashboard() {

  const [formData, setFormData] = useState({ title: '', description: '', price: '', date_time: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await sessionsAPI.create(formData);
      alert('🚀 Session Created Successfully!');
      setFormData({ title: '', description: '', price: '', date_time: '' });
      window.location.reload();
    } catch (error) {
      alert('❌ Failed to publish slot. Verify your role is Creator.');
    }
  };

  return (
    <Base>
      <div style={{ fontFamily: 'sans-serif', maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#111827', fontSize: '28px', margin: '0 0 6px 0' }}>🎓 Creator Workspace</h2>
          <p style={{ color: '#6B7280', margin: 0 }}>Manage your schedules, track system accounts, and publish mentorship blocks.</p>
        </div>



        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Add Mentorship Slot</h3>
          <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" name="title" placeholder="Session Title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}></textarea>
            <input type="number" step="0.01" name="price" placeholder="Price ($)" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
            <input type="datetime-local" name="date_time" value={formData.date_time} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Schedule</button>
          </form>
        </div>



      </div>
    </Base>
  );
}

export default CreatorDashboard;
