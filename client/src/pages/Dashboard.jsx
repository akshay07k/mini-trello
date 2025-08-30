import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import BoardCard from '../components/BoardCard';
import WorkspaceSidebar from '../components/WorkspaceSidebar';
import { AuthContext } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardVisibility, setBoardVisibility] = useState('private');
  const [workspaceName, setWorkspaceName] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [owner, setOwner] = useState(null);

  const { user } = useContext(AuthContext);
  const socketRef = useSocket();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data);
      if (res.data.length) {
        setActiveWorkspace(res.data[0]._id);
        setOwner(res.data[0].owner);
      }
    } catch (err) {
      setWorkspaces([]);
    }
  };

  useEffect(() => {
    if (!activeWorkspace) return;
    api.get(`/boards/w/${activeWorkspace}`)
      .then(res => setBoards(res.data))
      .catch(() => setBoards([]));
  }, [activeWorkspace]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeWorkspace) return;

    socket.emit('join:workspace', activeWorkspace);

    socket.on('board:created', (board) => {
      if (board.workspace === activeWorkspace) {
        setBoards(prev => [board, ...prev]);
      }
    });

    socket.on('workspace:created', (workspace) => {
      setWorkspaces(prev => [...prev, workspace]);
    });

    return () => {
      socket.emit('leave:workspace', activeWorkspace);
      socket.off('board:created');
      socket.off('workspace:created');
    };
  }, [socketRef, activeWorkspace]);

  const createBoard = async () => {
    if (!boardTitle.trim() || !activeWorkspace) return;
    try {
      const res = await api.post('/boards', {
        title: boardTitle,
        visibility: boardVisibility,
        workspace: activeWorkspace
      });

      socketRef.current.emit('board:created', res.data);

      setBoards(prev => [res.data, ...prev]);
      setBoardTitle('');
      setBoardVisibility('private');
    } catch (err) {
      console.error(err);
    }
  };

  const createWorkspace = async () => {
    if (!workspaceName.trim()) return;
    try {
      const res = await api.post('/workspaces', { name: workspaceName });

      socketRef.current.emit('workspace:created', res.data);

      setWorkspaces(prev => [...prev, res.data]);
      setActiveWorkspace(res.data._id);
      setOwner(res.data.owner)
      setWorkspaceName('');
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="flex h-[94vh]">
      <WorkspaceSidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        workspaceName={workspaceName}
        setWorkspaceName={setWorkspaceName}
        createWorkspace={createWorkspace}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Boards</h1>

          {user._id === owner && (
            <div className="flex gap-2">
              <input value={boardTitle} onChange={e => setBoardTitle(e.target.value)} placeholder="New board title" 
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <select value={boardVisibility} onChange={e => setBoardVisibility(e.target.value)} className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                <option value="private">Private</option>
                <option value="workspace">Workspace</option>
              </select>

              <button onClick={createBoard} className="bg-blue-600 text-white px-4 h-10 rounded">Create</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {boards.map(b => (
            (b.visibility === "workspace" || user._id === owner) && <BoardCard key={b._id} board={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
