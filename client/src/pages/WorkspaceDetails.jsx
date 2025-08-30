import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function WorkspaceDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [id]);

  async function fetchMembers() {
    try {
      setLoading(true);
      const res = await api.get(`/workspaces/${id}/members`);
      
      setWorkspaceMembers(res.data.members || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch members");
      setLoading(false);
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      await api.post(`/workspaces/${id}/add-member`, { email: newMemberEmail });
      setSuccessMsg("Member added successfully");
      setNewMemberEmail("");
      fetchMembers(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  }

  async function handleRemoveMember(memberId) {
    try {
      await api.delete(`/workspaces/${id}/remove-member/${memberId}`);
      setSuccessMsg("Member removed successfully");
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  }

  async function handleDeleteWorkspace() {
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await api.delete(`/workspaces/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete workspace");
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workspace Settings</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {successMsg && <p className="text-green-700 mb-3">{successMsg}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        {loading ? (
          <p>Loading members...</p>
        ) : workspaceMembers.length === 0 ? (
          <p>No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {workspaceMembers.map((m) => (
              <li
                key={m._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{m.email}</span>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRemoveMember(m._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAddMember} className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter member email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <button className="bg-blue-500 text-white px-2 h-14 rounded">
          Add Member
        </button>
      </form>

      <div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleDeleteWorkspace}
        >
          Delete Workspace
        </button>
      </div>
    </div>
  );
}
