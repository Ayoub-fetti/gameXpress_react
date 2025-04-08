
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './assets/pages/auth/Login';
import Register from './assets/pages/auth/Register';
import Dashboard from './assets/pages/dashboard/Dashboard';
import ProtectedRoute from './assets/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App
