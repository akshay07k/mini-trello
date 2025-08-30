import React, { useContext, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      // keep your existing behavior: login takes token
      await login(res.data.token);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={submit} 
        className="bg-white rounded-2xl shadow-2xl p-8 w-96 flex flex-col"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        {err && <div className="text-red-600 mb-4 text-center">{err}</div>}

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white h-10 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/register" className="text-blue-600 font-medium hover:underline ml-1">
            Register
          </Link>
        </div>
      </form>
    </div>

  );
}
