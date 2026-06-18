import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ConnectPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const userId = user?.id;
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 
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

  // Fetch suggested connections
  useEffect(() => {
    if (!userId) return;
    const fetchSuggestedPeople = async () => {
      try {
        const response = await fetch(`${API_URL}/api/connectionroute/suggested/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch suggested users");
        const data = await response.json();
        setSuggestedPeople(data);
      } catch (error) {
        console.error("Error fetching suggested people:", error);
      }
    };
    fetchSuggestedPeople();
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


  const handleConnect = async (receiverId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/api/connectionroute/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: userId, receiver_id: receiverId }),
      });
  
      if (!response.ok) throw new Error("Failed to send connection request");
  
      // Remove the connected person from the suggestions list
      setSuggestedPeople(suggestedPeople.filter((person) => person.id !== receiverId));
    } catch (error) {
      console.error("Error sending connection request:", error);
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
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Main Content */}
      <div className="w-2/3 p-6 bg-gray-800 shadow-md rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">My Network</h1>
          <button
            onClick={() => navigate("/invitation")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Invitations
          </button>
        </div>

        {/* Invitations */}
        {invitations.length > 0 ? (
          invitations.slice(0, 2).map((person) => (
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

        {/* Suggested People */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-white">People You May Know</h2>
          <div className="grid grid-cols-2 gap-4">
            {suggestedPeople.length > 0 ? (
              suggestedPeople.map((person) => (
                <div key={person.id} className="p-4 bg-gray-700 border border-gray-600 rounded-md shadow-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <FaUserCircle className="text-3xl text-gray-400 mr-3" />
                    <div>
                      <p className="font-semibold text-white">{person.name}</p>
                    </div>
                  </div>
                  <button  onClick={() => handleConnect(person.id)} className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No suggestions available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-1/3 p-6">
        <div className="p-4 bg-gray-800 shadow-lg rounded-lg">
          <h2 className="font-bold text-gray-100 text-lg">See who’s hiring on ConnectHive</h2>
          <img
            src="https://via.placeholder.com/300"
            alt="Ad Banner"
            className="mt-4 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
