import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const {isAuthenticated, logout, hasRole } = useAuth();
  const capitalizeFirstLetter = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <>
      <header className="bg-indigo-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold">E-Commerce</h1>
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {hasRole(['super_admin', 'product_manager']) && (
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-gray-200 transition"
                  >
                    {capitalizeFirstLetter('dashboard')}
                  </Link>
                )}
                {hasRole(['super_admin', 'product_manager']) && (
                  <Link
                    to="/categories"
                    className="text-white hover:text-gray-200 transition"
                  >
                    {capitalizeFirstLetter('categories')}
                  </Link>
                )}
                {hasRole(['super_admin', 'product_manager']) && (
                  <Link
                    to="/products"
                    className="text-white hover:text-gray-200 transition"
                  >
                    {capitalizeFirstLetter('products')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-white hover:text-gray-200 transition"
                >
                  {capitalizeFirstLetter('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition"
                >
                  {capitalizeFirstLetter('login')}
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-gray-200 transition"
                >
                  {capitalizeFirstLetter('register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <Outlet />
      </main>
    </>
  );
  
};

export default Layout;