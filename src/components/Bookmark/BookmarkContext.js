import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BookmarkContext = createContext();

const API_URL = "https://connecthive-connectbackend.onrender.com"; 

export const BookmarkProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
    }
}, []);

const userId = user?.id;



  // Fetch bookmarks on load or when userId changes
  useEffect(() => {
    if (!userId) return; // If no userId, do nothing

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bookmarks/${userId}`);
        setBookmarkedPosts(res.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, [userId]); // Trigger effect when userId changes

  // Toggle bookmark
  const toggleBookmark = async (post) => {
    if (!userId) return; // If no userId, do nothing

    try {
      const res = await axios.post(`${API_URL}/api/bookmarks/toggle`, {
        user_id: userId, // Use passed userId
        post_id: post.post_id
      });
      console.log("Toggle Bookmark response:", res.data);

      // Update UI immediately after toggling
      setBookmarkedPosts((prev) => {
        const exists = prev.some((p) => p.post_id === post.post_id);
        if (exists) {
          console.log("Removing bookmark for post", post.post_id);
          return prev.filter((p) => p.post_id !== post.post_id);
        } else {
          console.log("Adding bookmark for post", post.post_id);
          return [...prev, post];
        }
      });

      console.log(res.data.message);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedPosts, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
