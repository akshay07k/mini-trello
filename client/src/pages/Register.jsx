import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (e) {
      setErr(e.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={submit} 
        className="bg-white rounded-2xl shadow-2xl p-8 w-96 flex flex-col"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register</h2>

        {err && <div className="text-red-600 mb-4 text-center">{err}</div>}

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          required
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          required
        />

        <button 
          type="submit"
          className="w-full bg-green-800 text-white h-10 rounded-lg font-semibold hover:bg-green-900 transition"
        >
          Register
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-blue-600 font-medium hover:underline ml-1">
            Login
          </Link>
        </div>
      </form>
    </div>

  );
}
