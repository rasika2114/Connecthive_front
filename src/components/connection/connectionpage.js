import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function ConnectionPage() {
  const [user, setUser] = useState(null);
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [invResponse, sugResponse, connResponse] = await Promise.all([
          fetch(`${API_URL}/api/connectionroute/pending/${userId}`),
          fetch(`${API_URL}/api/connectionroute/suggested/${userId}`),
          fetch(`${API_URL}/api/connectionroute/connections/${userId}`),
        ]);

        if (!invResponse.ok || !sugResponse.ok || !connResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [invData, sugData, connData] = await Promise.all([
          invResponse.json(),
          sugResponse.json(),
          connResponse.json(),
        ]);

        setInvitations(invData);
        setSuggestedPeople(sugData);
        setConnections(connData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-4xl w-2/3 p-6 bg-gray-800 shadow-md rounded-lg p-8 border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">My Connections</h2>
        {connections.length > 0 ? (
          <div className="overflow-y-auto h-[450px] space-y-4">
            {connections.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 border-b border-gray-700">
                <div className="flex items-center">
                <FaUserCircle className="text-3xl text-gray-400 mr-3" />
                <div>
                <p className="font-semibold text-white">{person.name}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">You have no connections yet.</p>
        )}
      </div>
    </div>
  );
}
