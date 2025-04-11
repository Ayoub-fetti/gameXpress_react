import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, People, BarChart } from '@mui/icons-material';
import api from '../../api/axios';

const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    out_of_stock_products: 0,
    latest_products: []
  });
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    console.log("User data in Dashboard:", {
      user,
      hasRequiredRoles: user?.user?.roles?.some(role => 
        ['product_manager', 'super_admin'].includes(role.name)
      )
    });
  }, [user]);

  useEffect(() => {
      const fetchStatistics = async () => {
        setLoading(true);
        try {
          const { data } = await api.get('v1/admin/dashboard');
          setStatistics({
            total_products: data.total_products || 0,
            total_categories: data.total_categories || 0,
            total_users: data.total_users || 0,
            out_of_stock_products: data.out_of_stock_products || 0,
            latest_products: data.latest_products || []
          });
        } catch (error) {
          console.error('Failed to fetch dashboard statistics:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStatistics();
    }, []);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
    // Format currency for revenue display
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MAD'
      }).format(amount);
    };


    return (
      <div className="max-w-7xl mx-auto mt-10 mb-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-6">
          Welcome back, {user.user.user?.name} {user.roles[0].name}
        </p>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Products</p>
              <ShoppingCart className="text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold">{statistics.total_products}</p>
          </div>
    
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Users</p>
              <People className="text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold">{statistics.total_users}</p>
          </div>
    
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Categories</p>
              <BarChart className="text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold">{statistics.total_categories}</p>
          </div>
    
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Out of Stock Products</p>
              <DashboardIcon className="text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold">{statistics.out_of_stock_products}</p>
          </div>
        </div>
    
        <div className="mt-10 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Latest Products</h2>
          {statistics.latest_products.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {statistics.latest_products.map((product) => (
                <li key={product.id}>
                  {product.name} - {formatCurrency(product.price)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No latest products available.</p>
          )}
        </div>
      </div>
    );
    
};

export default Dashboard;