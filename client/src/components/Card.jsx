import React from 'react';

export default function Card({ card, onClick }) {
  return (
    <div className="p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer flex justify-between items-center transition">
      <p className="text-gray-700">{card.title}</p>
      <span onClick={onClick} className="text-gray-400 hover:text-gray-700 cursor-pointer">✐</span>
    </div>
  );
}
