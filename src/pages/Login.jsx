import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

// Form field configuration - makes it easy to add/modify fields

const formFields = [
  {
    id: 'email',
    label: 'Email Address',
    type: 'text',
    name: 'email',
    autoComplete: 'email',
    autoFocus: true,
    required: true
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    name: 'password',
    autoComplete: 'current-password',
    required: true
  }
];

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login , isAuthenticated  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(credentials);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  // Reusable form field component
  const renderFormField = (field) => (
    <TextField
      key={field.id}
      margin="normal"
      fullWidth
      id={field.id}
      label={field.label}
      name={field.name}
      type={field.type}
      autoComplete={field.autoComplete}
      autoFocus={field.autoFocus}
      required={field.required}
      value={credentials[field.name]}
      onChange={handleChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: 'indigo',
          },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'indigo',
      },
    }}
    />
  );

  return (
    <div className="max-w-xs mx-auto">
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
  
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="w-full mt-1 space-y-4">
          {formFields.map(renderFormField)}
  
          <button
            type="submit"
            className="w-full bg-indigo-900 hover:bg-indigo-800 text-white py-2 rounded-md mt-3 mb-2 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;