import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ActivitySidebar({ boardId }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!boardId) return;
    api.get(`/activity/${boardId}`).then(res => setItems(res.data)).catch(() => setItems([]));
  }, [boardId]);

  return (
    <aside className="w-80 bg-white p-4 rounded-xl shadow-lg max-h-[90vh] overflow-auto">
      <h4 className="font-semibold text-lg mb-4 border-b pb-2">Activity</h4>
      <div className="space-y-3 text-sm">
        {items.map(it => (
          <div key={it._id} className="border-b pb-2 last:border-none">
            <div className="text-xs text-gray-400">{new Date(it.timestamp).toLocaleString()}</div>
            <div className="font-medium text-gray-700">{it.action}</div>
            <div className="text-gray-500 text-sm">{it.details}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
