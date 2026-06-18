import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../Bookmark/BookmarkButton";
import { useBookmarks } from "../Bookmark/BookmarkContext";

function Feed() {
  const { bookmarkedPosts, toggleBookmark } = useBookmarks();
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [stats, setStats] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/post`);
        const reversed = res.data.reverse();
        setPosts(reversed);

        reversed.forEach((post) => {
          fetchStats(post.id);
          fetchComments(post.id);
        });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const fetchStats = async (postId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/posts/post/${postId}/stats`,
        { params: { userId } }
      );
      setStats((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/posts/comments/${postId}`
      );
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/posts/post/${postId}/like`, {
        userId,
      });

      const res = await axios.get(
        `${API_URL}/api/posts/post/${postId}/stats`,
        { params: { userId } }
      );

      setStats((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      await axios.post(`${API_URL}/api/posts/post/${postId}/comment`, {
        userId,
        content,
      });

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      await fetchComments(postId);

      setStats((prevStats) => ({
        ...prevStats,
        [postId]: {
          ...prevStats[postId],
          comments: (prevStats[postId]?.comments || 0) + 1,
          likes: prevStats[postId]?.likes || 0,
        },
      }));
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div style={styles.feedContainer}>
      {posts.slice(0, visibleCount).map((post) => {
        const contentIsLong = post.content && post.content.length > 150;
        const showFull = expandedPosts.includes(post.id);
        const displayedContent =
          showFull || !contentIsLong
            ? post.content
            : post.content.slice(0, 150) + "...";

        const postStats = stats[post.id] || { likes: 0, comments: 0, userLiked: false };
        const postComments = comments[post.id] || [];

        return (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={styles.avatar}></div>
              <div>
                <h3 style={styles.postAuthor}>{post.name}</h3>
                <p style={styles.postTime}>
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p style={styles.postContent}>
              {displayedContent}
              {contentIsLong && (
                <span
                  onClick={() => toggleReadMore(post.id)}
                  style={styles.readMore}
                >
                  {showFull ? " Read Less" : " Read More"}
                </span>
              )}
            </p>

            {post.photo && (
              <a
                href={`${API_URL}/${post.photo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${API_URL}/${post.photo}`}
                  alt="post"
                  style={styles.postImage}
                />
              </a>
            )}

            {post.video && (
              <video controls style={styles.postVideo}>
                <source
                  src={`${API_URL}/${post.video}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}

            {post.article && (
              <a
                href={`${API_URL}/${post.article}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p style={styles.attachmentLink}>
                  <strong>Article:</strong> {post.article}
                </p>
              </a>
            )}

            <div style={styles.postActions}>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: postStats.userLiked ? "#e74c3c" : "#3b3b98",
                }}
                onClick={() => handleLike(post.id)}
              >
                {postStats.userLiked ? "❤ Unlike" : "🤍 Like"} ({postStats.likes})
              </button>

              <button
                style={styles.actionButton}
                onClick={() => fetchComments(post.id)}
              >
                💬 Comment ({postStats.comments})
              </button>

              <BookmarkButton
                postId={post.id}
                userId={userId}
                postTitle={post.title || post.name || "Untitled Post"}
                postContent={post.content}
                postAuthor={post.name}
                postTime={new Date(post.createdAt).toLocaleString()}
                postImage={post.photo ? `${API_URL}/${post.photo}` : ""}
                postVideo={post.video ? `${API_URL}/${post.video}` : ""}
                postArticleLink={
                  post.article ? `${API_URL}/${post.article}` : ""
                }
                onBookmarkToggle={() => {}}
              />
            </div>

            <div style={styles.commentSection}>
              {postComments.map((c, index) => (
                <div key={index} style={styles.comment}>
                  <strong>{c.userName}:</strong> {c.content}
                </div>
              ))}
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment[post.id] || ""}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                style={styles.commentInput}
              />
              <button
                style={styles.commentButton}
                onClick={() => handleCommentSubmit(post.id)}
              >
                Submit
              </button>
            </div>
          </div>
        );
      })}

      {visibleCount < posts.length && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button style={styles.showMoreButton} onClick={handleShowMore}>
            Show More Posts
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  feedContainer: {
    width: "100%",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "absolute",
    top: "90px",
  },
  postCard: {
    padding: "20px",
    marginTop: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    color: "#e0e0e0",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "50px",
    height: "50px",
    background: "gray",
    borderRadius: "50%",
  },
  postAuthor: {
    fontSize: "18px",
    margin: 0,
    color: "#bb86fc",
  },
  postTime: {
    fontSize: "12px",
    color: "#ccc",
    margin: 0,
  },
  postContent: {
    marginTop: "15px",
    fontSize: "16px",
  },
  readMore: {
    color: "#bb86fc",
    cursor: "pointer",
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "15px",
  },
  postVideo: {
    width: "100%",
    marginTop: "15px",
    borderRadius: "10px",
  },
  attachmentLink: {
    color: "#e0e0e0",
    marginTop: "10px",
    textDecoration: "underline",
  },
  postActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "10px 15px",
    borderRadius: "8px",
    background: "#3b3b98",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  showMoreButton: {
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    background: "linear-gradient(145deg, #4413a6, #ff4757)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  commentSection: {
    marginTop: "15px",
  },
  comment: {
    marginBottom: "5px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "8px",
    borderRadius: "6px",
  },
  commentInput: {
    width: "80%",
    padding: "8px",
    borderRadius: "6px",
    marginTop: "10px",
    marginRight: "10px",
    border: "1px solid #999",
    color: "black",
  },
  commentButton: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

export default Feed;
