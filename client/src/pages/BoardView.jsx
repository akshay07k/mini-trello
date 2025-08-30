import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import useSocket from '../hooks/useSocket';
import ListColumn from '../components/ListColumn';
import CardModal from '../components/CardModal';
import ActivitySidebar from '../components/ActivitySidebar';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

export default function BoardView() {
  const { id: boardId } = useParams();
  const socketRef = useSocket();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [openCard, setOpenCard] = useState(null);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // group cards by listId
  const cardsByList = useMemo(() => {
    const map = {};
    for (const l of lists) map[l._id] = [];
    for (const c of cards) {
      if (!map[c.listId]) map[c.listId] = [];
      map[c.listId].push(c);
    }
    Object.values(map).forEach(arr => arr.sort((a,b) => (a.position ?? 0) - (b.position ?? 0)));
    return map;
  }, [lists, cards]);

  useEffect(() => {
    const fetchAll = async () => {
      const [bRes, lRes, cRes] = await Promise.all([
        api.get(`/boards/${boardId}`),
        api.get(`/lists/board/${boardId}`),
        api.get(`/cards/board/${boardId}`)
      ]);
      
      setBoard(bRes.data);
      setLists(lRes.data);
      setCards(cRes.data);
    };
    fetchAll();
  }, [boardId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('join:board', boardId);

    socket.on('card:created', ({ card }) => setCards(prev => [...prev, card]));
    socket.on('card:updated', ({ card }) => setCards(prev => prev.map(c => c._id === card._id ? card : c)));
    socket.on('card:moved', ({ cardId, toListId, position }) => {
      setCards(prev => prev.map(c => c._id === cardId ? { ...c, listId: toListId, position } : c));
    });

    return () => {
      socket.emit('leave:board', boardId);
      socket.off('card:created');
      socket.off('card:updated');
      socket.off('card:moved');
    };
  }, [socketRef, boardId]);

  const createList = async () => {
    if (!newListTitle.trim()) return;
    const res = await api.post(`/lists/board/${boardId}`, { title: newListTitle });
    setLists(prev => [...prev, res.data]);
    setNewListTitle('');
    setAddingList(false);
  };

  const createCard = async (listId, title) => {
    const res = await api.post(`/cards/board/${boardId}/list/${listId}`, { title });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const movingCard = cards.find(c => c._id === draggableId);
    if (!movingCard) return;
  
    const fromListId = source.droppableId;
    const toListId = destination.droppableId;
  
    if (fromListId === toListId && destination.index === source.index) return;
  
    // Optimistic UI update
    let newCards = [...cards];
    newCards = newCards.filter(c => c._id !== draggableId);
  
    // Prepare destination list
    const destCards = newCards.filter(c => c.listId === toListId);
    destCards.splice(destination.index, 0, { ...movingCard, listId: toListId });
  
    const otherCards = newCards.filter(c => c.listId !== toListId);
    const updatedCards = [...otherCards, ...destCards];
  
    setCards(updatedCards);
  
    // Compute before/after using updatedCards instead of old `cards`
    const destListCardsForPayload = updatedCards.filter(c => c.listId === toListId);
    const before = destListCardsForPayload[destination.index - 1] || null;
    const after = destListCardsForPayload[destination.index + 1] || null;
  
    const payload = {
      toListId,
      beforeCardId: before?._id || null,
      afterCardId: after?._id || null
    };
  
    try {
      await api.post(`/cards/${draggableId}/move`, payload);
    } catch (err) {
      console.error('Failed to move card', err);
    }
  };
  
  

  const openCardModal = (card) => setOpenCard(card);
  const closeCardModal = () => setOpenCard(null);

  return (
    <div className="p-6 flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{board?.title || 'Board'}</h2>
          <div>
            {addingList ? (
              <div className="flex gap-2">
                <input 
                  className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={newListTitle} 
                  onChange={e => setNewListTitle(e.target.value)} placeholder="List title" 
                />
                <button onClick={createList} className="px-3 h-10 bg-blue-600 text-white rounded">Add</button>
                <button onClick={() => setAddingList(false)} className="px-3 h-10 border border-gray-100 rounded">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setAddingList(true)} className="px-3 py-1 bg-green-800 text-white rounded">+ Add list</button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 overflow-x-auto pb-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {lists.map(list => (
            <Droppable key={list._id} droppableId={list._id} direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <ListColumn
                    list={list}
                    cards={(cardsByList[list._id] || []).sort((a,b)=> (a.position||0)-(b.position||0))}
                    onCreateCard={createCard}
                    openCard={openCardModal}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>

        </div>
      </div>

      <div className="w-80">
        <ActivitySidebar boardId={boardId} />
      </div>

      {openCard && <CardModal card={openCard} onClose={closeCardModal} onSaved={async () => {
        const res = await api.get(`/cards/board/${boardId}`);
        setCards(res.data);
      }} />}
    </div>
  );
}
