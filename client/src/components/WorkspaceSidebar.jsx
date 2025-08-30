import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ellipsis } from "lucide-react"

export default function WorkspaceSidebar({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  workspaceName,
  setWorkspaceName,
  createWorkspace
}) {

  const { user } = useContext(AuthContext);

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Workspaces</h2>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {workspaces.map(ws => (
          <div key={ws._id} className="flex justify-between items-center">
            <button
              onClick={() => setActiveWorkspace(ws._id)}
              className={`text-left px-3 py-2 rounded flex-1 ${activeWorkspace === ws._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            >
              {ws.name}
            </button>

            {ws.owner == user._id && (<Link
              to={`/workspaces/${ws._id}`}
              className="ml-2 px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
              title="Open workspace settings"
            >
              <Ellipsis  size={20}/>
            </Link>)}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          value={workspaceName}
          onChange={e => setWorkspaceName(e.target.value)}
          placeholder="New workspace"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button onClick={createWorkspace} className="w-full bg-green-800 text-white px-3 py-2 rounded">Add Workspace</button>
      </div>
    </div>
  );
}
