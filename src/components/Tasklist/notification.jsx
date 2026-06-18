import React, { useState, useEffect } from "react";
import "./notification.css";

function NotificationComponent() {

    // const clientId = user?.id;
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [clientId, setClientId] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notifiedTasks, setNotifiedTasks] = useState(new Set());
    const [permissionGranted, setPermissionGranted] = useState(Notification.permission === "granted");
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
            setClientId(storedUser.id);
        }
    }, []);

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.register("/service-worker.js")
                .then(reg => console.log("Service Worker Registered:", reg))
                .catch(err => console.error("Service Worker Registration Failed:", err));
        }
    }, []);

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("🔔 Notification permission granted!");
                setPermissionGranted(true);
            } else {
                console.warn("⚠ Notification permission denied.");
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
        }
    };

    useEffect(() => {
        if (!("Notification" in window)) {
            console.error("This browser does not support notifications.");
            return;
        }

        if (clientId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Fetch in every 1 min
            return () => clearInterval(interval);
        }
    }, [clientId, permissionGranted]);
    
    

    
    const fetchNotifications = async () => {
        try {

            if (!clientId) {
                console.error("Client ID not found!");
                return;
            }
            console.log("Client ID:", clientId);

            const response = await fetch(`${API_URL}/api/tasks/task/notifications/${clientId}`);
            if (!response.ok) throw new Error("Failed to fetch notifications");

            const data = await response.json();
            console.log("Fetched Notifications:", data);

            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
            const currentDate = now.toISOString().slice(0, 10);

            console.log("Current Date:", currentDate);
            console.log("Current Time:", currentTime);

            data.forEach((task) => {
                const taskDate = task.task_date.slice(0,10);
                const taskTime = task.task_time.slice(0,5);

                console.log("Task ID:", task.id);
                console.log("Task Date:", taskDate);
                console.log("Task Time:", taskTime);


                if (taskDate === currentDate && taskTime <= currentTime && !notifiedTasks.has(task.id)) {
                    sendNotification(task);
                    setNotifiedTasks((prevSet) => new Set(prevSet).add(task.id));
                }
                else {
                    console.log("Notification Condition NOT Met for Task ID:", task.id);
                    if (taskDate !== currentDate) {
                        console.log("Date did not match. CurrentDate:", currentDate, "TaskDate:", taskDate);
                    }
                    if (taskTime > currentTime) {
                        console.log("Time was greater then current time. CurrentTime:", currentTime, "TaskTime:", taskTime);
                    }
                }
            });

            setNotifications(data);
            console.log("Notifications State:", data); 
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const sendNotification = async (task) => {
        console.log("🔔 Attempting to send notification...");

        if (Notification.permission === "granted" && "serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;

            registration.showNotification("Task Reminder! 📌", {
                body: `Task: ${task.task_name}\nTime: ${task.task_time}\n✅ Stay productive!`,
                icon: "https://cdn-icons-png.flaticon.com/512/1827/1827272.png"
            });

            console.log(`Notification shown for task: ${task.task_name}`);
        } else {
            console.warn("⚠ Notification permission not granted.");
        }
    };

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            {!permissionGranted && (
                <button onClick={requestNotificationPermission}>Enable Notifications 🔔</button>
            )}
            <div className="notification-list">
                {notifications.length > 0 ? (
                    notifications.map((task) => (
                        <div key={task.id} className="notification-item">
                            <p><strong>{task.task_name}</strong></p>
                            <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No new notifications.</p>
                )}
            </div>
        </div>
    );
}

export default NotificationComponent;