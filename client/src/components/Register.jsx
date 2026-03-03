import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(formData.email, formData.password, formData.name);
    
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
          <h2 className="mt-6 font-extrabold text-display text-gray-900 text-3xl text-center">
            CREATE YOUR ACCOUNT
          </h2>
          <p className="mt-2 text-gray-600 text-label text-sm text-center">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 text-label hover:text-indigo-500">
              SIGN IN TO YOUR EXISTING ACCOUNT
            </Link>
          </p>
        </div>
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md font-label text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-label font-medium text-gray-700 text-sm">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-label font-medium text-gray-700 text-sm">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-label font-medium text-gray-700 text-sm">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-label font-medium text-gray-700 text-sm">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="block focus:z-10 relative mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full font-inter text-gray-900 sm:text-sm appearance-none placeholder-gray-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
