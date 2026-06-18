import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./stylesnotification.css"; // Ensure it matches LinkedIn style

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    // Only proceed if user is not null
    useEffect(() => {
        if (!user) return;
    
        const fetchNotifications = async () => {
            try {
                // Fetch pending connection requests
                const pendingRes = await axios.get(`${API_URL}/api/notifications/notifications/${user.id}/pending`);
    
                // Fetch accepted connection notifications
                const acceptedRes = await axios.get(`${API_URL}/api/notifications/notifications/${user.id}/accepted`);
                
                // Fetch post notifications
                const postRes = await axios.get(`${API_URL}/api/notifications/notifications/${user.id}/posts`);
                
                // Combine both notifications
                const allNotifications = [...pendingRes.data, ...acceptedRes.data , ...postRes.data];
    
                // Update state
                setNotifications(allNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
    
        fetchNotifications();
    }, [user]);
    

    return (
        <div className="notifications-page">
            <div className="notification-wrapper">
                <h1 className="notifications-header">Notifications</h1>
                <div className="notifications-container">
                    {notifications.length === 0 ? (
                        <p>No notifications yet</p>
                    ) : (
                        <ul>
                        {notifications.map((notif, index) => (
                            <li
                                key={index}
                                className={`${notif.read ? "read" : "unread"} ${notif.type === "post_update" ? "post-update-notif" : ""}`}
                            >
                                <div className="notif-card">
                                    <p>{notif.message}</p>
                                    {notif.type === "post_update" && (
                                        <span>{moment(notif.createdAt).format("MMMM D, YYYY h:mm A")}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
