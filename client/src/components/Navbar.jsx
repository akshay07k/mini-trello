import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-2xl text-gray-800">Mini-Trello</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600 font-medium">{user.name ?? user.email}</span>
            <button onClick={logout} className="text-red-600 font-semibold hover:text-red-800">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-gray-900">Register</Link>
          </>
        )}
      </div>
    </nav>

  );
}
