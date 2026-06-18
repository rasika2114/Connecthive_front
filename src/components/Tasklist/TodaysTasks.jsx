import React, { useState, useEffect } from 'react';
import { FaBell, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';


function TodaysTasks() {
    const [tasks, setTasks] = useState([]);
        const [taskList, setTaskList] = useState([]);
        const [date , setDate] = useState(new Date());
        const [time , setTime] = useState('');
        const [showCalendar, setShowCalendar] = useState(false);
        const [editIndex, setEditIndex] = useState(null); 
        const [showTimePicker, setShowTimePicker] = useState(false);
        const [showTodayTasks, setShowTodayTasks] = useState(false);
        const [todayTasks , setTodayTasks] = useState([]);
        const [showUpcomingTasks, setShowUpcomingTasks] = useState(false);
        const [userId, setUserId] = useState(null);
        const [token, setToken] = useState(null);
        const API_URL = "https://connecthive-connectbackend.onrender.com"; 
        
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');

        console.log("Stored User:", storedUser);
        console.log("Stored Token:", storedToken);

        if (storedUser && storedToken) {
            setUserId(storedUser.id);
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (userId && token) {
            console.log("userId and token are valid. Fetching tasks.");
            fetchTodayTasks(userId);
        } else {
            console.log("userId or token is not valid. Skipping task fetch.");
        }
    }, [userId, token]);

    

            const fetchTodayTasks = async (client_id) => {
                try {
                    if(!client_id) return;

                    const response = await axios.get(`https://connecthive-connectbackend.onrender.com/api/tasks/task/today/${client_id}`, {
                       headers: { Authorization: `Bearer ${token}` } 
                    });

                    const data = response.data
                    console.log('Fetched Data:', data);
    
                    if (Array.isArray(data)) {
                        setTasks(data);
                        setTaskList(data);
                    } else {
                        setTasks([]); 
                        setTaskList([]); 
                    }
                } catch (error) {
                    console.error("Error fetching today's tasks:", error);
                }
            };
            
        const handleEdit = (index) => {
            const taskToEdit = tasks[index];
            setDate(taskToEdit.task_date ? new Date(taskToEdit.task_date) : new Date());
            setTime(taskToEdit.task_time);
            setEditIndex(index);
        };

    const handleDelete = async (index) => {
        const taskId = tasks[index].task_id;
        try{
         await axios.delete(`${API_URL}/api/tasks/task/${taskId}` , { headers: { Authorization: `Bearer ${token}` },
            data: { client_id: userId }

         });
    
            const filteredTasks = taskList.filter((_, i) => i !== index);
            setTasks(filteredTasks);
            setTaskList(filteredTasks);
           }
           catch (error) {
            console.error("Error in deleting the task:", error);
          }
    };

    const handleCheckboxChange = (index) => {
        const updatedTaskList = [...taskList];
        updatedTaskList[index].completed = !updatedTaskList[index].completed;
        setTaskList(updatedTaskList);
    }

    return (
        <div className='today-tasks-container'>
            <h2>Today's Tasks</h2>
            <div  className='task-list'>
            {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <div key={index} className="today-task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>handleCheckboxChange(index)} 
                            className="task-checkbox"
                        />
                        <p><strong>{task.task_name}</strong></p>
                        {/* <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p> */}
                        {/* <p>{new Date(task.task_date).toLocaleDateString('en-US', { timeZone: 'UTC' })} | {task.task_time}</p> */}
                        <p>{new Date(task.task_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })} | {task.task_time}</p>
                        {/* {task.remainder && <p><FaBell /> Reminder Set</p>} */}
                        <div className="task-actions">
                            <button onClick={() => handleEdit(index)}><FaEdit /></button> 
                            <button onClick={() => handleDelete(index)}><FaTrash /></button> 
                        </div>
                    </div>
                ))
            ) : (
                <p>No tasks for today.</p>
            )}
        </div>
        </div>
    );
}

export default TodaysTasks;