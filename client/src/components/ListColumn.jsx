import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import Card from './Card';

export default function ListColumn({ list, cards, onCreateCard, openCard }) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onCreateCard(list._id, newCardTitle);
    setNewCardTitle('');
    setAddingCard(false);
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-3 w-[350px] flex-shrink-0 shadow hover:shadow-lg transition">
      <h3 className="font-bold mb-3 text-gray-800">{list.title}</h3>
      <div className="flex flex-col gap-3">
        {cards.map((card, index) => (
          <Draggable key={card._id} draggableId={card._id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <Card card={card} onClick={() => openCard(card)} />
              </div>
            )}
          </Draggable>
        ))}
      </div>
      {addingCard ? (
        <div className="mt-3 flex gap-2">
          <input 
            className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={newCardTitle} 
            onChange={e => setNewCardTitle(e.target.value)} placeholder="Card title"
          />
          <button onClick={handleAddCard} className="px-3 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
          <button onClick={() => setAddingCard(false)} className="px-3 h-10 border rounded-lg hover:bg-gray-100">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAddingCard(true)} className="mt-3 text-blue-600 hover:underline">+ Add card</button>
      )}
    </div>

  );
}
