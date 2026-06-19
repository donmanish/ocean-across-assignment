// 🔍 Grab the backend gateway target straight from your Docker environment file
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Helper to fetch secure headers automatically with your JWT Bearer key
 */
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export default getAuthHeaders;