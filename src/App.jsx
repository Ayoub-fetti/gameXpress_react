import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Category from './pages/admin/Category';
import Product from './pages/admin/Product';
import ProductDetail from './pages/product/detail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              
              <Route element={<AuthRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              
              <Route path="unauthorized" element={<Unauthorized />} />
              
              {/* Product detail route - public */}
              <Route path="products/:id" element={<ProductDetail />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute roles={['product_manager', 'super_admin']} />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute roles={['super_admin']} />}>
                <Route path="categories" element={<Category />} />
              </Route>
              
              <Route element={<ProtectedRoute roles={['product_manager', 'super_admin']} />}>
                <Route path="products" element={<Product />} />
              </Route>
            </Route>
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;