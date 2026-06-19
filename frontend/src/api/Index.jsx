import getAuthHeaders from "./Header";

const BASE_URL = import.meta.env.VITE_API_URL;



// --- 1. OAUTH HANDSHAKE CONFIGURATION ---
export const oauthAPI = {
    // 💡 NEW FUNCTION: Builds the secure Google login path cleanly
    getGoogleAuthUrl: () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: 'http://localhost/',
            response_type: 'code',
            scope: 'openid email profile',
            prompt: 'select_account consent'
        });

        const finalAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();

        return finalAuthUrl;
    },

    exchangeCode: async (provider, authCode) => {
        const response = await fetch(`${BASE_URL}auth/oauth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, access_token: authCode })
        });
        if (!response.ok) throw new Error('OAuth exchange failed on server');
        return response.json();
    }
};

// --- 2. MARKETPLACE SESSIONS CATALOG CONFIGURATION ---
export const sessionsAPI = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}sessions/`);
        if (!response.ok) throw new Error('Failed to load session rows');
        return response.json();
    },
    create: async (sessionData) => {
        const response = await fetch(`${BASE_URL}sessions/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) throw new Error('Unauthorized or invalid payload input');
        return response.json();
    }
};

// --- 3. MENTORSHIP BOOKINGS CONFIGURATION ---
export const bookingsAPI = {
    getUserBookings: async () => {
        const response = await fetch(`${BASE_URL}bookings/`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile reservations');
        return response.json();
    },
    create: async (sessionId) => {
        const response = await fetch(`${BASE_URL}bookings/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ session: sessionId })
        });
        if (!response.ok) throw new Error('Booking transaction rejected');
        return response.json();
    }
};

export const userAPI = {
    updateProfile: async (profileData) => {
        const response = await fetch(`${BASE_URL}auth/profile/update/`, {
            method: 'PATCH',
            headers: getAuthHeaders(), // Sends your secure JWT bearer header automatically
            body: JSON.stringify(profileData)
        });
        
        if (!response.ok) throw new Error('Failed to update profile data on server');
        return response.json();
    }
    
};