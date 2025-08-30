import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

export default function CardModal({ card, onClose, onSaved }) {
  const [data, setData] = useState(card || {});
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [assignees, setAssignees] = useState(card?.assignees || []);
  const [showMemberList, setShowMemberList] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setData(card || {});
    setAssignees(card?.assignees || []);
    if (card) {
      fetchComments();
      fetchBoardMembers();
    }
  }, [card]);

  // Fetch comments
  const fetchComments = async () => {
    if (!card) return;
    try {
      const res = await api.get(`/comments/${card._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('fetchComments', err);
    }
  };

  // Fetch all members of the board
  const fetchBoardMembers = async () => {
    if (!card) return;
    try {
      const res = await api.get(`/boards/${id}/members`);
      setBoardMembers(res.data.members);
    } catch (err) {
      console.error('fetchBoardMembers', err);
    }
  };

  // Save card 
  const save = async () => {
    try {
      await api.patch(`/cards/${card._id}`, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        assignees
      });
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      console.error('save card', err);
    }
  };

  // Add comment
  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/comments/${card._id}`, { text: commentText });
      setCommentText('');
      await fetchComments();
    } catch (err) {
      console.error('addComment', err);
    }
  };

  // Toggle assignee (add or remove)
  const toggleAssignee = (memberId) => {
    setAssignees(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  // Toggle showing member list
  const toggleMemberList = () => setShowMemberList(prev => !prev);

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded shadow p-6 z-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Card: {data.title}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm">Title</label>
          <input
            className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={data.title || ''}
            onChange={e => setData({ ...data, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm">Description</label>
          <textarea
            className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={data.description || ''}
            onChange={e => setData({ ...data, description: e.target.value })}
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="text-sm">Due Date</label>
          <input
            type="date"
            className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ''}
            onChange={e => setData({ ...data, dueDate: e.target.value })}
          />
        </div>

        {/* Assignees */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Assignees</label>
          
          {/* Current assignees */}
          <div className="flex flex-wrap gap-2 mt-1 mb-2">
            {assignees.length > 0
              ? assignees.map(id => {
                  const member = boardMembers.find(m => m._id === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                      onClick={() => toggleAssignee(id)}
                      title="Click to remove"
                    >
                      {member?.name || 'Load...'} ✕
                    </span>
                  );
                })
              : <span className="text-gray-500">No assignees yet</span>
            }
          </div>

          {/* Add Assignees Button */}
          <button
            onClick={toggleMemberList}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add Assignees
          </button>

          {/* Members list panel */}
          {showMemberList && (
            <div className="mt-2 border p-2 rounded max-h-40 overflow-y-auto bg-gray-50">
              {boardMembers.map(member => (
                <div key={member._id} className="flex justify-between items-center mb-1">
                  <span>{member.name}</span>
                  {!assignees.includes(member._id) && (
                    <button
                      onClick={() => toggleAssignee(member._id)}
                      className="px-2 py-1 text-sm bg-green-800 text-white rounded"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mb-4">
          <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>

        {/* Comments */}
        <div>
          <h4 className="font-semibold mb-2">Comments</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
            {comments.map(c => (
              <div key={c._id} className="bg-gray-50 p-2 rounded">
                <div className="text-sm font-medium">{c.author?.name || 'Unknown'}</div>
                <div className="text-sm">{c.text}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Write a comment..."
            />
            <button onClick={addComment} className="bg-green-800 text-white px-3 h-10 rounded">Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
