import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login, isLoading, error: authError } = useAuth();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await login(email, password);
        setEmail('');
        setPassword('');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  // return (
  //   <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
  //     <div className="flex border-b mb-6">
  //       <button className="flex-1 py-2 font-semibold border-b-2 border-black">Login</button>
  //       <button
  //         type="button"
  //         onClick={onSwitchToRegister}
  //         className="flex-1 py-2 text-gray-500 hover:text-gray-700"
  //       >
  //         Register
  //       </button>
  //     </div>
  //     <h1 className="text-2xl font-bold mb-2">Login</h1>
  //     <p className="text-gray-500 mb-6">Enter your credentials to access your account</p>
  //     <form onSubmit={handleSubmit}>
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">Email</label>
  //         <input
  //           type="email"
  //           placeholder="email@gmail.com"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
  //         />
  //         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  //       </div>
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">Password</label>
  //         <div className="relative">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
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
  //         disabled={isLoading}
  //         className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
  //       >
  //         {isLoading ? 'Signing in...' : 'Sign in'}
  //       </button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex border-b mb-8">
        <button className="flex-1 py-3 font-semibold border-b-2 border-blue-500 text-blue-600">
          Connexion
        </button>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="flex-1 py-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          Inscription
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Se connecter</h1>
      <p className="text-gray-500 mb-8">Entrez vos identifiants pour accéder à votre compte</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none focus:ring-blue-300 ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        
        <div className="flex justify-end">
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Mot de passe oublié?
          </a>
        </div>
  
        {authError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {authError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion en cours...
            </span>
          ) : 'Se connecter'}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Vous n'avez pas de compte?{' '}
          <a href="#" onClick={onSwitchToRegister} className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
