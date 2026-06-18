import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";



export default function InvitationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 

  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }, []);
  
const userId = user?.id;

// Fetch pending invitations
useEffect(() => {
  if (!userId) return;
  const fetchInvitations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/connectionroute/pending/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch invitations");
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };
  fetchInvitations();
}, [userId]);


// Accept invitation
const handleAccept = async (connectionId) => {
  try {
    const response = await fetch(`${API_URL}/api/connectionroute/connections/${connectionId}/accept`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to accept request");
    setInvitations(invitations.filter((inv) => inv.id !== connectionId));
  } catch (error) {
    console.error("Error accepting request:", error);
  }
};

// Reject invitation
const handleReject = async (connectionId) => {
  try {
    const response = await fetch(`${API_URL}/api/connectionroute/connections/${connectionId}/reject`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to reject request");
    setInvitations(invitations.filter((inv) => inv.id !== connectionId));
  } catch (error) {
    console.error("Error rejecting request:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="bg-gray-800 shadow-lg p-6 rounded-lg max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-white w-full">Invitations</h1>

        {/* Invitations */}
        {invitations.length > 0 ? (
          invitations.map((person) => (
            <div key={person.id} className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center">
                <FaUserCircle className="text-3xl text-gray-400 mr-3" />
                <div>
                  <p className="font-semibold text-white">{person.name}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleReject(person.id)}
                  className="px-4 py-1 border border-gray-500 rounded-md text-gray-300 hover:bg-gray-700"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleAccept(person.id)}
                  className="px-4 py-1 bg-blue-600 text-white rounded-md ml-2 hover:bg-blue-500"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No invitations at the moment.</p>
        )}

        <button
          onClick={() => navigate("/connect")}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Back to My Network
        </button>
      </div>
    </div>
  );
}
