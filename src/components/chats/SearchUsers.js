import React, { useState, useEffect } from "react";

function SearchUsers({ onSelectUser }) {
    const [query, setQuery] = useState(""); // User's search input
    const [users, setUsers] = useState([]); // List of matching users
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    useEffect(() => {
        if (query.length < 2) {
            setUsers([]);
            return;
        }

        // Fetch users from the backend using POST method
        fetch(`${API_URL}/api/chat/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }) // Send query as part of the request body
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users:", err));
    }, [query]); // Runs every time `query` changes

    return (
        <div>
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#fff", // Ensure the background is white to show text properly
                    color: "#000", // Ensure the text is black
                    borderRadius: "5px",
                    border: "1px solid #ccc", // Ensure the border is visible
                }}
            />
            {users.length > 0 && (
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        maxHeight: "200px", // Limit the height to make it scrollable
                        overflowY: "auto", // Enable vertical scrolling
                        border: "1px solid #ddd", // Add a border around the results
                        marginTop: "10px", // Add some space between the input and the results
                    }}
                >
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => onSelectUser(user)}
                            style={{
                                cursor: "pointer",
                                color:"black",
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#f9f9f9", // Light background for better readability
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ddd")} // Highlight on hover
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9f9f9")} // Reset hover
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchUsers;
