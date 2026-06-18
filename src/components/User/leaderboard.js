import { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeaderBoardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postLeaders, setPostLeaders] = useState([]);
  const [connectionLeaders, setConnectionLeaders] = useState([]);
  const BASE_URL = "https://connecthive-connectbackend.onrender.com";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const postRes = await axios.get(`${BASE_URL}/api/leaderboard/leaderboard/posts`);
        const connectionRes = await axios.get(`${BASE_URL}/api/leaderboard/leaderboard/connections`);
        console.log(postRes.data);
        console.log(connectionRes.data);
        
        setPostLeaders(postRes.data);
        setConnectionLeaders(connectionRes.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboards();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
        🏆 Leaderboard
      </h1>

      {/* Container for both leaderboards */}
      <div className="flex flex-col md:flex-row gap-6 max-h-[75vh] md:overflow-y-hidden overflow-y-auto">
        {/* Posts Leaderboard */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto max-h-[75vh]">
          <div className="flex items-center mb-4">
            <Trophy className="text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Top Users by Posts
            </h2>
          </div>
          <ul>
            {postLeaders.map((leader, index) => (
              <li
                key={leader.id}
                className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-none"
              >
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  #{index + 1} {leader.name}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  📝 {leader.total_posts} posts
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Connections Leaderboard */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto max-h-[75vh]">
          <div className="flex items-center mb-4">
            <Users className="text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Top Users by Connections
            </h2>
          </div>
          <ul>
            {connectionLeaders.map((leader, index) => (
              <li
                key={leader.id}
                className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-none"
              >
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  #{index + 1} {leader.name}
                </span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  🤝 {leader.accepted_connections} connections
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
