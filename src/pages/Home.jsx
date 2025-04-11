import { Typography, Container, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col justify-center items-center text-center min-h-[60vh] my-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to Our E-Commerce Store Game Express
        </h2>
        <h2 className="text-xl md:text-2xl text-gray-700">
          {isAuthenticated
            ? `Hello, ${user.user.user?.name}!`
            : 'Please login or register to continue'}
        </h2>
  
        {!isAuthenticated && (
          <div className="mt-6 flex space-x-4">
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md text-lg hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-md text-lg hover:bg-indigo-50 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Home;