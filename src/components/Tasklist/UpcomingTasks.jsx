import React, { useState, useEffect } from 'react';
import { FaBell, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
// import './TodaysTasks.css'
// import './UpcomingTasks.css';

function UpcomingTasks() {
    const [tasks, setTasks] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const API_URL = "https://connecthive-connectbackend.onrender.com";

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUserId(storedUser.id);
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (userId && token) {
            fetchUpcomingTasks(userId);
        }
    }, [userId, token]);

    const fetchUpcomingTasks = async (client_id) => {
        try {
            const response = await axios.get(`${API_URL}/api/tasks/task/upcoming/${client_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching upcoming tasks:", error);
        }
    };

    const handleEdit = (index) => {
        const taskToEdit = tasks[index];
        setEditIndex(index);
    };
    const handleDelete = (index) => {
        const taskId = tasks[index].task_id;
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const client_id = storedUser ? storedUser.id : null;

        if (!client_id) {
            console.error("Client ID not found in local storage");
            return;
        }

        axios.delete(`${API_URL}/api/tasks/task/${taskId}`, {
            data: { client_id: client_id }, 
        })
        .then(() => {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            console.log("Task deleted successfully");
        })
        .catch(err => {
            console.error("Error deleting the task:", err);
        });
    };

    return (
        <div className='today-tasks-container'>
            <h2>Upcoming Tasks</h2>
            <div className='task-list'>
            {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <div key={index} className="today-task-item">
                        <p><strong>{task.task_name}</strong></p>
                        <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p>
                        <div className="task-actions">
                            <button onClick={() => handleEdit(index)}><FaEdit /></button> 
                            <button onClick={() => handleDelete(index)}><FaTrash /></button> 
                        </div>
                    </div>
                ))
            ) : (
                <p>No upcoming tasks.</p>
            )}
        </div>
        </div>
    );
}

export default UpcomingTasks;