import { createContext, useContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../api/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const { data } = await api.get('/user');
          console.log(data.roles);
          setUser({
            user: data,
            roles: data.roles|| []
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);


   const hasRole = (requiredRoles) => {
    console.log('Required Roles:', requiredRoles);
    console.log('User Roles:', user?.roles);
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user?.roles) return false;
    return user.roles.some(role => requiredRoles.includes(role));
  };


  const login = async (credentials) => {
    try {
      await getCsrfCookie(); // Get CSRF cookie for Laravel Sanctum
      const { data } = await api.post('/login', credentials);
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      const userData = {user: data.user, roles: data.user.roles || []};
      console.log(data);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (credentials) => {
    try {
      await getCsrfCookie(); // Get CSRF cookie for Laravel Sanctum
      const { data } = await api.post('/register', credentials);


      localStorage.setItem('token', data.token);
      setToken(data.token);
      const userData = {user: data.user, roles: data.user.roles || []};
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, message: error.response?.data?.message || 'Register failed' };
    }
  };


  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated,
      loading,
      hasRole,
      login,
      register,
      logout,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);