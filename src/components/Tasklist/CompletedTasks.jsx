import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from "react-icons/fa";
import './TodaysTasks.css';

function CompletedTasks() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 

    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_URL}/api/tasks/task/completed/${user.id}`)
                .then(response => setTasks(response.data))
                .catch(error => console.error("Error fetching completed tasks:", error));
        }
    }, [user]);


  // Handle task deletion
  const handleDelete = (taskId) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const clientId = loggedInUser?.id; // Corrected line

    if (!clientId) {
        console.error("Client ID not found!");
        return;
    }

    axios.delete(`${API_URL}/api/tasks/task/${taskId}`, {
        data: { client_id: clientId }
    })
        .then(() => {
            setTasks(tasks.filter(task => task.task_id !== taskId));
        })
        .catch(err => console.error("Error deleting task:", err));
};

  return (
    <div className='today-tasks-container'>
      <h2>Completed Tasks</h2>
      <div className='task-list'>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.task_id} className="today-task-item">
            <p><strong>{task.task_name}</strong></p>
            <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p>
            {/* {task.remainder && <p>Reminder Set</p>} */}
            <div className="task-actions">
              <button onClick={() => handleDelete(task.task_id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No completed tasks.</p>
      )}
    </div>
    </div>
  );
}

export default CompletedTasks;