import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { oauthAPI } from '../../../api/Index';

function Header() {
    const { user, logout, loginWithProviderToken } = useContext(AuthContext);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            window.history.replaceState({}, document.title, window.location.pathname);
            loginWithProviderToken('google', code);
        }
    }, [loginWithProviderToken]);

    const handleGoogleLogin = () => {
        window.location.href = oauthAPI.getGoogleAuthUrl();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 border-bottom border-primary border-4 shadow-sm">
            <div className="container-fluid">

                {/* Brand Logo & Title Link */}
                <a href="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none me-auto">
                    <span className="mb-0 h5 fw-bold text-white ms-2">🌊</span>
                </a>

                {/* Mobile Hamburger Toggle Button */}
                <button
                    className="navbar-toggler ms-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#marketplaceHeaderNavbar"
                    aria-controls="marketplaceHeaderNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Container (Drops down on mobile, aligns right on desktop) */}
                <div className="collapse navbar-collapse justify-content-end mt-3 mt-lg-0" id="marketplaceHeaderNavbar">
                    <div className="navbar-nav align-items-start align-items-lg-center">
                        {user ? (

                            /* Profile Interactive Dropdown Container */
                            <div className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {/* Google User Profile Avatar */}
                                    <img
                                        src={user.avatar_url || 'https://placeholder.com'}
                                        alt="Google User Avatar"
                                        className="rounded-circle border border-primary border-2"
                                        style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://placeholder.com'; }}
                                    />
                                    <span className="fs-6 fw-semibold">
                                        {user.username}
                                    </span>
                                </a>

                                {/* Floating Dropdown Menu Panel Box */}
                                <ul className="dropdown-menu dropdown-menu-end shadow border-light mt-2">
                                    <li className="px-3 py-2 border-bottom text-muted small">
                                        Role: <span className="badge bg-secondary text-capitalize">{user.role}</span>
                                    </li>

                                    {/* Dynamic Dashboard Navigation Endpoint */}
                                    <li>
                                        {user?.role === 'creator' ? (
                                            <a href="/creator-dashboard" className="dropdown-item fw-bold text-success py-2">
                                                🛠️ Creator Dashboard
                                            </a>
                                        ) : (
                                            <a href="/dashboard" className="dropdown-item fw-bold text-primary py-2">
                                                👤 My Dashboard
                                            </a>
                                        )}
                                    </li>

                                    <li><hr className="dropdown-divider" /></li>

                                    {/* Action Logout Account Option */}
                                    <li>
                                        <button onClick={logout} className="dropdown-item fw-bold text-danger py-2">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            /* Guest State: Default Google Sign-In Action Trigger */
                            <button
                                onClick={handleGoogleLogin}
                                className="btn btn-danger btn-md fw-bold px-4 shadow w-100 w-lg-auto"
                            >
                                Login with Google
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default  Header;