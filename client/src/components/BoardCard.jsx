import React from 'react';
import { Link } from 'react-router-dom';

export default function BoardCard({ board }) {
  return (
    <Link 
      to={`/board/${board._id}`} 
      className="block bg-white rounded-xl p-5 shadow hover:shadow-xl transition duration-200 ease-in-out"
    >
      <h3 className="font-semibold text-lg">{board.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{board.visibility}</p>
    </Link>
  );
}
