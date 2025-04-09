import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading: isSubmitting, error: authError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await register(formData.username, formData.email, formData.password);
        // Reset form on success
        setFormData({ username: '', email: '', password: '' });
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  // return (
  //   <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
  //     <div className="flex border-b mb-6">
  //       <button
  //         type="button"
  //         onClick={onSwitchToLogin}
  //         className="flex-1 py-2 text-gray-500 hover:text-gray-700"
  //       >
  //         Login
  //       </button>
  //       <button className="flex-1 py-2 font-semibold border-b-2 border-black">Register</button>
  //     </div>
  //     <h1 className="text-2xl font-bold mb-2">Register</h1>
  //     <p className="text-gray-500 mb-6">Enter your details to create an account</p>
  //     <form onSubmit={handleSubmit}>
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">Username</label>
  //         <div className="relative">
  //           <input
  //             type="text"
  //             name="username"
  //             value={formData.username}
  //             onChange={handleChange}
  //             placeholder="username"
  //             className={`w-full border rounded px-3 py-2 pr-10 ${errors.username ? 'border-red-500' : ''}`}
  //           />
  //         </div>
  //         {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
  //       </div>

  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">Email</label>
  //         <div className="relative">
  //           <input
  //             type="email"
  //             name="email"
  //             value={formData.email}
  //             onChange={handleChange}
  //             placeholder="email@gmail.com"
  //             className={`w-full border rounded px-3 py-2 pr-10 ${errors.email ? 'border-red-500' : ''}`}
  //           />
  //         </div>
  //         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  //       </div>

  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">Password</label>
  //         <div className="relative">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             name="password"
  //             value={formData.password}
  //             onChange={handleChange}
  //             className={`w-full border rounded px-3 py-2 pr-10 ${errors.password ? 'border-red-500' : ''}`}
  //           />
  //           <button
  //             type="button"
  //             onClick={() => setShowPassword(!showPassword)}
  //             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
  //           >
  //             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  //           </button>
  //         </div>
  //         {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
  //       </div>

  //       {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
  //       <button
  //         type="submit"
  //         disabled={isSubmitting}
  //         className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
  //       >
  //         {isSubmitting ? 'Registering...' : 'Register'}
  //       </button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex border-b mb-8">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="flex-1 py-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          Connexion
        </button>
        <button className="flex-1 py-3 font-semibold border-b-2 border-blue-500 text-blue-600">
          Inscription
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Créer un compte</h1>
      <p className="text-gray-500 mb-8">Remplissez vos informations pour commencer</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Nom d'utilisateur</label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="votre_nom"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none focus:ring-blue-300 ${
                errors.username ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
        </div>
  
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemple.com"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none focus:ring-blue-300 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
        </div>
  
        <div>
          <label className="block mb-2 font-medium text-gray-700">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:outline-none focus:ring-blue-300 ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {showPassword ? (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
        </div>
  
        {authError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {authError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription en cours...
            </span>
          ) : 'Sinscrire'}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          En vous inscrivant, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>{' '}
          et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
