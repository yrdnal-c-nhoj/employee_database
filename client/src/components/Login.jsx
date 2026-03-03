import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div>
          <h2 className="mt-3 font-display font-medium text-gray-900 text-3xl text-center">
            Sign In to Your Account
          </h2>
          <p className="mt-0 font-display text-gray-600 text-sm text-center">
            or{' '}   <p></p>
            <Link to="/register" className="font-medium text-indigo-600 text-label hover:text-indigo-500">
              CREATE A NEW ACCOUNT
            </Link>
          </p>
        </div>
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md font-label text-red-600">
              {error}
            </div>
          )}
          <div className="-space-y-px shadow-sm rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block focus:z-10 relative px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-none rounded-t-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block focus:z-10 relative px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-none rounded-b-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-label font-medium text-white text-sm transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
