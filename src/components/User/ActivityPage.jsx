import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityPage() {
  const API_BASE = "https://connecthive-connectbackend.onrender.com/api/posts";
  const FILE_BASE = "https://connecthive-connectbackend.onrender.com";
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_BASE}/post/user/${userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [userId]);


  
  // 🗑️ Handle delete post
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/post/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Your Activity</h1>

      <div className="h-[80vh] overflow-y-auto pr-2">
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts found.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 p-4 rounded-xl shadow-md space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    {post.name}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                {post.content && (
                  <p className="text-sm text-gray-300">{post.content}</p>
                )}

                {post.photo && (
                  <img
                    src={`${FILE_BASE}/${post.photo}`}
                    alt="Post"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-700"
                  />
                )}

                {post.video && (
                  <video
                    controls
                    className="w-64 h-40 rounded-lg border border-gray-700"
                  >
                    <source src={`${FILE_BASE}/${post.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {post.article && (
                  <a
                    href={`${FILE_BASE}/${post.article}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline block text-sm"
                  >
                    📄 View Article
                  </a>
                )}

                {post.event && (
                  <a
                    href={`${FILE_BASE}/${post.event}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 underline block text-sm"
                  >
                    📢 View Event File
                  </a>
                )}


<button
                  onClick={() => handleDelete(post.id)}
                  className="mt-2 text-red-500 hover:underline text-sm"
                >
                  Delete Post
                </button>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
