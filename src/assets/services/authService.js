import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  login: async (credentials) => {
    // Récupération du cookie CSRF
    await axios.get(`http://localhost:8000/sanctum/csrf-cookie`, { 
      withCredentials: true 
    });
    
    // Récupération du token CSRF du cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    // Envoi de la requête avec le token CSRF
    const response = await axios.post(`${API_URL}/v1/admin/login`, credentials, {
      headers: { 
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(token) // Important: decoder le token
      },
      withCredentials: true,
    });
    
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  register: async (credentials) => {
    // Même logique pour le register
    await axios.get(`http://localhost:8000/sanctum/csrf-cookie`, { 
      withCredentials: true 
    });
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    const response = await axios.post(`${API_URL}/v1/admin/register`, credentials, {
      headers: { 
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(token)
      },
      withCredentials: true,
    });
    
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: async () => {
    try {
      // Get the auth token from localStorage
      const authToken = localStorage.getItem('token');
      
      if (!authToken) {
        console.error('No auth token found in localStorage');
        return;
      }
      
      // First fetch a fresh CSRF cookie
      await axios.get(`http://localhost:8000/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      // Increased delay to ensure cookie is fully set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Extract CSRF token from cookies - using a more robust approach
      let csrfToken = '';
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('XSRF-TOKEN=')) {
          csrfToken = cookie.substring('XSRF-TOKEN='.length, cookie.length);
          break;
        }
      }
        
      if (!csrfToken) {
        console.error('XSRF-TOKEN not found in cookies');
        return;
      }
      
      // Decode the token
      const decodedToken = decodeURIComponent(csrfToken);
      
      // Log token for debugging
      console.log('Using CSRF token:', decodedToken);
      
      // Send logout request with both CSRF token and Auth token
      const response = await axios.post(
        `${API_URL}/v1/admin/logout`,
        {}, // Empty body
        {
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': decodedToken,
            'Authorization': `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      
      // Verify successful response
      console.log('Logout API response:', response);
      
      // Clean up after successful logout
      localStorage.removeItem('token');
      console.log('Logout successful');
      
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      
      throw error;
    }
  }
};

export default authService;