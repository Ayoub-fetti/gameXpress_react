import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Use axios directly to make a public request without auth headers
        const response = await axios.get(`${API_BASE_URL}/api/cart/products`);
        
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setProducts([]);
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Game Express
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {isAuthenticated
              ? `Hello, ${user?.user?.user?.name || 'User'}!`
              : 'Discover our latest games and accessories'}
          </p>
          
          {!isAuthenticated && (
            <div className="mt-2 flex justify-center space-x-4">
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to Game Express
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          {isAuthenticated
            ? `Hello, ${user?.user?.user?.name || 'User'}!`
            : 'Discover our latest games and accessories'}
        </p>
        
        {!isAuthenticated && (
          <div className="mt-2 flex justify-center space-x-4">
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

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product image */}
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image_url.startsWith('http') 
                      ? product.images[0].image_url 
                      : `${API_BASE_URL}${product.images[0].image_url}`}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>
              
              {/* Product info */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'available' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <p className="text-lg font-bold text-indigo-600 mb-2">
                  {formatCurrency(product.price)}
                </p>
                
                <div className="mt-4 flex justify-between items-center">
                  
                  <Link to = {`/products/${product.id}`}
                    className={`px-3 py-1 rounded-md text-white ${
                      product.status === 'available'
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={product.status !== 'available'}
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;