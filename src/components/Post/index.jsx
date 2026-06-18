import { useEffect, useState, useRef } from "react";
import { FaImage, FaVideo, FaCalendarAlt, FaEdit } from "react-icons/fa";
import axios from "axios";

const Post = () => {
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    const [files, setFiles] = useState({
        photo: null,
        video: null,
        article: null,
        event: null,
    });

    // References for file input elements
    const photoInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const eventInputRef = useRef(null);
    const articleInputRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/posts/post`)
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    // Handle file change (for photo, video, article, event)
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        setFiles(prevFiles => ({
            ...prevFiles,
            [type]: file, // Set the respective file type
        }));
    };

    // Handle post submission
    const handlePostSubmit = async () => {
        if (!content.trim()) {
            alert("Post content cannot be empty.");
            return;
        }
        if (!token || !user) {
            alert("Please log in first.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        formData.append("userId", user.id);

        // Append files for each category if they exist
        for (const [type, file] of Object.entries(files)) {
            if (file) {
                formData.append(type, file); // Add file to FormData
            }
        }

        try {
            await axios.post(`${API_URL}/api/posts/post`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Added post");
            const response = await axios.get(`${API_URL}/api/posts/post`);
            setPosts(response.data);
            setContent("");
            setFiles({ photo: null, video: null, article: null, event: null });
        } catch (error) {
            console.error("Error posting content:", error.response?.data || error.message);
            alert("Failed to create post!");
        }
    };

    // Trigger click on the corresponding file input when the icon is clicked
    const handleIconClick = (type) => {
        switch (type) {
            case "photo":
                photoInputRef.current.click();
                break;
            case "video":
                videoInputRef.current.click();
                break;
            case "event":
                eventInputRef.current.click();
                break;
            case "article":
                articleInputRef.current.click();
                break;
            default:
                break;
        }
    };

    return (
        <div className="post-container">
            <div className="post-header">
                <img src="https://via.placeholder.com/50" alt="User" className="profile-pic" />
                <textarea
                    placeholder="Start a post..."
                    className="post-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="post-actions">
                <button className="action-btn" onClick={() => handleIconClick("photo")}>
                    <FaImage className="action-icon image-icon" /> Photo
                    <input
                        type="file"
                        ref={photoInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "photo")}
                    />
                </button>
                <button className="action-btn" onClick={() => handleIconClick("video")}>
                    <FaVideo className="action-icon video-icon" /> Video
                    <input
                        type="file"
                        ref={videoInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "video")}
                    />
                </button>
                <button className="action-btn" onClick={() => handleIconClick("event")}>
                    <FaCalendarAlt className="action-icon event-icon" /> Event
                    <input
                        type="file"
                        ref={eventInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "event")}
                    />
                </button>
                <button className="action-btn" onClick={() => handleIconClick("article")}>
                    <FaEdit className="action-icon article-icon" /> Write Article
                    <input
                        type="file"
                        ref={articleInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "article")}
                    />
                </button>
            </div>

            <button className="post-button" onClick={handlePostSubmit}>Post</button>
        </div>
    );
};

export default Post;
