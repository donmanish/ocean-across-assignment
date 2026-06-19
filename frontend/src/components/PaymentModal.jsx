import React, { useState } from 'react';

function PaymentModal({ session, onClose, onPaymentSuccess }) {
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '' });
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    // 💡 Simulating a 2-second bank processing transaction link delay
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess(session.id);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#111827' }}>🔒 Secure Checkout</h3>
        <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '14px' }}>You are booking: <strong>{session.title}</strong></p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F3F4F6', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
          <span>Total Amount:</span>
          <span style={{ color: '#059669' }}>${session.price}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>Card Number</label>
            <input type="text" name="number" placeholder="4111 2222 3333 4444" maxLength="16" value={cardForm.number} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>Expiry Date</label>
              <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" value={cardForm.expiry} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>CVC</label>
              <input type="text" name="cvc" placeholder="123" maxLength="3" value={cardForm.cvc} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} disabled={processing} style={{ flex: 1, background: '#E5E7EB', color: '#374151', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={processing} style={{ flex: 2, background: '#059669', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              {processing ? 'Processing Card...' : `Pay $${session.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default PaymentModal;