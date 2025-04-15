import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PanierSidebar from './PanierSidebar';

const Layout = () => {
  const { isAuthenticated, logout, hasRole } = useAuth();
  const { toggleCart, getCartCount } = useCart();
  const cartItemCount = getCartCount();
  
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
            
            {/* Cart Icon with Badge */}
            <IconButton 
              onClick={toggleCart}
              sx={{ color: 'white' }}
              className="hover:text-gray-200 transition"
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </nav>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <Outlet />
      </main>
      
      {/* Cart Sidebar */}
      <PanierSidebar />
    </>
  );
};

export default Layout;