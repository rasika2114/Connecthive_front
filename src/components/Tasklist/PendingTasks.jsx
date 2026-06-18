import React, { useEffect, useState , useCallback  } from 'react';
import axios from 'axios';
import { FaBell , FaCheck, FaTrash } from "react-icons/fa";
import './TodaysTasks.css';

function PendingTasks({ onTaskCompletedUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 

  
  // fetching pending tasks here.....
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
        const clientId = storedUser.id;
        console.log("PendingTasks clientId (from localStorage user.id):", clientId);

        axios.get(`${API_URL}/api/tasks/task/pending/${clientId}`)
            .then(response => {
                console.log("PendingTasks API response:", response.data);
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching pending tasks:", error);
                setTasks([]); 
            });
    } else {
        console.log("PendingTasks: User not found or id missing in localStorage");
        setTasks([]);
    }
}, []);



const markCompleted = useCallback((taskId) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const clientId = storedUser?.id;

  if (!clientId) return;

  axios.put(`${API_URL}/api/tasks/task/complete/${taskId}`, { client_id: clientId })
      .then(() => {
          axios.get(`${API_URL}/api/tasks/task/pending/${clientId}`)
              .then(response => setTasks(response.data))
              .catch(error => console.error("Error refetching pending tasks:", error));

          axios.get(`${API_URL}/api/tasks/task/completed/${clientId}`)
              .then(response => {
                  console.log("Completed tasks after mark:", response.data);
                  if (onTaskCompletedUpdate) {
                      onTaskCompletedUpdate(response.data);
                  }
              })
              .catch(error => console.error("Error fetching completed tasks:", error));
      })
      .catch(error => console.error("Error updating task:", error));
}, [onTaskCompletedUpdate]);

 
  const handleDelete = (taskId) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const clientId = loggedInUser?.id;
    if (!clientId) return;
    axios.delete(`${API_URL}/api/tasks/task/${taskId}`, { data: { client_id: clientId } })
        .then(() => {
            setTasks(tasks.filter(task => task.task_id !== taskId));
        })
        .catch(err => console.error("Error deleting task:", err));
};

  return (
    <div className='today-tasks-container'>
      <h2>Pending Tasks</h2>
      <div  className='task-list'>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.task_id} className="today-task-item">
            <p><strong>{task.task_name}</strong></p>
            <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p>
            {/* {task.remainder && <p><FaBell /> Reminder Set</p>} */}
            <div className="task-actions">
              <button className='mark' onClick={() => markCompleted(task.task_id)}>
                <FaCheck /> Mark Completed
              </button>
              <button onClick={() => handleDelete(task.task_id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending tasks.</p>
      )}
    </div>
    </div>
  );
}

export default PendingTasks;