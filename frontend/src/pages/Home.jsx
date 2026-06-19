import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import { bookingsAPI, sessionsAPI } from '../api/Index'
import PaymentModal from '../components/PaymentModal' 
import Header from './dashboard/layout/Header'

function Home() {
    const [sessions, setSessions] = useState([])
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const [selectedSession, setSelectedSession] = useState(null)
    const [showPayment, setShowPayment] = useState(false)

    useEffect(() => {
        if (user?.role === 'creator') {
            navigate('/creator-dashboard', { replace: true })
        }
    }, [user, navigate])

    useEffect(() => {
        sessionsAPI.getAll()
            .then((data) => setSessions(data))
            .catch((err) => console.error('Error loading sessions:', err));
    }, []);

    if (user?.role === 'creator') {
        return (
            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center"><div className="spinner-border text-primary mb-3"></div><p className="text-muted fw-bold">Redirecting to Creator Workspace...</p></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container my-5">
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold text-dark mb-2">Available Training Sessions</h2>
                    <p className="text-muted fs-5">Browse schedules and book mentorship sessions instantly.</p>
                </div>
                {sessions.length === 0 ? (
                    <div className="alert alert-light text-center border border-dashed p-5 text-muted shadow-sm">No sessions listed in the catalog yet.</div>
                ) : (
                    <div className="row g-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-light rounded-3">
                                    <div className="card-body d-flex flex-column justify-content-between p-4">
                                        <div>
                                            <span className="badge bg-light text-primary mb-3 p-2 border rounded">By: {session.creator_details?.username || 'Mentor'}</span>
                                            <h5 className="card-title fw-bold text-dark mb-2">{session.title}</h5>
                                            <p className="card-text text-secondary lh-base small mb-4">{session.description}</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                                            <span className="h4 mb-0 fw-bold text-success">${session.price}</span>
                                            <button onClick={() => { setSelectedSession(session); setShowPayment(true); }} disabled={!user} className={`btn fw-bold px-4 rounded shadow-sm ${user ? 'btn-success' : 'btn-secondary'}`}>{user ? 'Book Now' : 'Login to Book'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showPayment && selectedSession && (
                <PaymentModal session={selectedSession} onClose={() => setShowPayment(false)} onPaymentSuccess={async (id) => {
                    try {
                        await bookingsAPI.create(id);
                        alert('💳 Payment Approved! Session Booked Successfully.');
                        window.location.reload();
                    } catch { alert('⚠️ Request Blocked by Rate Limiting Firewall.'); }
                }} />
            )}
        </>
    )
}

export default Home;
