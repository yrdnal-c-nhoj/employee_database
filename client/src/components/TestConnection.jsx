import React, { useState, useEffect } from 'react';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [envInfo, setEnvInfo] = useState('');

  useEffect(() => {
    // Check environment variables on mount
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    setEnvInfo(`VITE_API_URL: ${import.meta.env.VITE_API_URL || 'NOT_DEFINED'}\nFallback URL: ${apiUrl}`);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== Testing Connection ===');
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/test`;
      console.log('Full URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      const data = await response.json();
      setResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('=== Connection Error ===');
      console.error('Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      setResult(`❌ Error: ${error.name} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== Testing Login ===');
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/user/login`;
      console.log('Full URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      const data = await response.json();
      setResult(`✅ Login Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('=== Login Error ===');
      console.error('Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      setResult(`❌ Login Error: ${error.name} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 max-w-2xl">
      <h2 className="mb-4 font-bold text-xl">Test Server Connection</h2>
      
      <div className="bg-gray-100 mb-4 p-4 rounded">
        <h3 className="mb-2 font-semibold">Environment Info:</h3>
        <pre className="text-sm">{envInfo}</pre>
      </div>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 px-4 py-2 rounded text-white"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </div>
      
      {result && (
        <pre className="bg-gray-100 mt-4 p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
      
      <div className="bg-yellow-50 mt-4 p-4 rounded text-sm">
        <p className="font-semibold">Instructions:</p>
        <p>1. Open browser developer tools (F12)</p>
        <p>2. Go to Console tab</p>
        <p>3. Click the test buttons above</p>
        <p>4. Check console logs for detailed error information</p>
      </div>
    </div>
  );
};

export default TestConnection;
