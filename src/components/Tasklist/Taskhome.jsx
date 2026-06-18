import React, { useEffect, useState , useCallback } from 'react'
import { FaCalendarAlt , FaClock ,  FaBell , FaEdit , FaTrash} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from 'axios';
import TodaysTasks from './TodaysTasks';
import UpcomingTasks from './UpcomingTasks';
import PendingTasks from './PendingTasks';
import CompletedTasks from './CompletedTasks'; 


function Taskhome() {
    const [tasks , setTasks] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [date , setDate] = useState(new Date());
    const [time , setTime] = useState('');
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    const [showCalendar, setShowCalendar] = useState(false);
    const [editIndex, setEditIndex] = useState(null); 
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTodayTasks, setShowTodayTasks] = useState(false);
    const [todayTasks , setTodayTasks] = useState([]);
    const [showUpcomingTasks, setShowUpcomingTasks] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [showPendingTasks, setShowPendingTasks] = useState(false);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);


    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");

      console.log("Taskhome user:", storedUser);
      console.log("Taskhome token:", storedToken);


      if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          setTaskList([]);

          axios.get(`${API_URL}/api/tasks/task/${storedUser.id}`)
          .then(response => {
            setTaskList(response.data);
          })
          .catch(err => console.error("Error fetching tasks: ", err));
          fetchCompletedTasks(storedUser.id);
        }else {
          setUser(null);
          setTaskList([]);
      }
  }, [user?.id]);

  const fetchCompletedTasks = (clientId) => {
    
    if (!clientId) return;
    axios.get(`${API_URL}/api/tasks/task/completed/${clientId}`)
        .then(response => setCompletedTasks(response.data))
        .catch(error => console.error("Error fetching completed tasks:", error));
};

  
  const handleShowTodayTasks = () => {
    console.log("handleShowTodayTasks called");
    if (!user) return;

    const todayDate = new Date().toISOString().split("T")[0];
    console.log("Today's Date:", todayDate);
    const todayTasks = taskList.filter((task) => {
        if (task.task_date && task.client_id === user.id) {
            const taskDate = new Date(task.task_date).toISOString().split("T")[0]; 
            console.log("Task Date:", taskDate);
            console.log("User ID:", user.id, "Task Client ID:", task.client_id);
            return taskDate === todayDate; 
        }
        return false;
    });
    console.log("Today's Tasks: ", todayTasks);
    setTodayTasks(todayTasks);
    setShowTodayTasks(todayTasks.length > 0);
  };

const handleShowUpcomingTasks = () => {
  setShowUpcomingTasks(true);
};
const handleShowPendingTasks = () => {
  setShowPendingTasks(true);
};

const handleShowCompletedTasks = () => {
  setShowCompletedTasks(true);
};

const handleSubmit = async (e) => {
    e.preventDefault();
        if (!user) {
          console.error("User is not logged in!");
          return;
      }
        if(tasks.trim() === "")
           return;

        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;
            
          const newTask = { 
          task_name: tasks, 
          task_date: formattedDate,
          task_time: time,
          // remainder,
          client_id: user.id
      };

        if (editIndex !== null) {
            const taskId = taskList[editIndex].task_id;
            axios.put(`${API_URL}/api/tasks/task/${taskId}` , newTask)
               .then(response => {
                  const updatedTasks = [...taskList];
                  updatedTasks[editIndex] = {...newTask , task_id: taskId};
                  setTaskList(updatedTasks);
                  setEditIndex(null);
               })
               .catch(err => console.error("Error in updating the task : " , err));
            
        } else {
            axios.post(`${API_URL}/api/tasks/task` , newTask)
               .then(response => {
                // setTaskList((prevList) => [...prevList, {...newTask , task_id: response.data.taskId}
                const newTaskWithId = { ...newTask, task_id: response.data.taskId };
                setTaskList(prevList => [...prevList, newTaskWithId]);

               })
               .catch(err => console.error("Error in adding the tasks : " , err));
           
        }
        
        setTasks('');
        setTime('')
        // setRemainder(false);
        setDate(new Date());
      }
  

  const handleEdit = (index) => {
        const taskToEdit = taskList[index];
        setTasks(taskToEdit.task_name);
        setDate(taskToEdit.task_date ? new Date(taskToEdit.task_date) : new Date());
        setTime(taskToEdit.task_time);
        // setRemainder(taskToEdit.remainder);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const taskId = taskList[index].task_id;
        axios.delete(`${API_URL}/api/tasks/task/${taskId}` , { data: { client_id: user.id } })
           .then(() => {
            const filteredTasks = taskList.filter((_, i) => i !== index);
            setTaskList(filteredTasks);
           })
           .catch(err => console.error("Error in deleting the task : " , err));
    };

    const handleCheckboxChange = (index) => {
        const updatedTaskList = [...taskList];
        updatedTaskList[index].completed = !updatedTaskList[index].completed;
        setTaskList(updatedTaskList);
    }

    const handleDateChange = (selectedDate) => {
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(12, 0, 0, 0);
      setDate(adjustedDate);
      setShowCalendar(false);
  };

  const handleTaskCompletedUpdate = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
        fetchCompletedTasks(storedUser.id);
    }
} , []);


    return (
        <div className="task-container">
          <div className="sidebar">
                <button onClick={handleShowTodayTasks}>Today</button>
                <button onClick={handleShowUpcomingTasks}>Upcoming</button>
                <button onClick={handleShowPendingTasks}>Pending</button>
                <button onClick={handleShowCompletedTasks}>Completed</button>
            </div>
          <div className="input-section">
            <div className="input-wrapper">
              <div className="input-with-button">
                <input
                  type="text"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="Enter your Task......."
                  className="task-input"
                  onKeyDown={(e) => {if (e.key === 'Enter') handleSubmit(e); }}
                />
              </div>
      
              <div className="input-icons">
                <div className="input-icon date-icon">
                  <button className="date-button" onClick={() => setShowCalendar((prev) => !prev)}>
                    <FaCalendarAlt /> Date
                  </button>
                  {showCalendar && (
                    <div className="date-picker-container">
                      <Calendar
                        onChange={(handleDateChange)}
                          
                        value={date || new Date()}
                        minDate={new Date()} 
                        maxDate={new Date(2025, 12, 31)} 
                        showNeighboringMonth={false} 
                      />
                    </div>
                  )}
                </div>
      
                <div className="input-icon">
                  <button className="time-button" onClick={() => setShowTimePicker((prev) => !prev)}>
                    <FaClock /> Time
                  </button>

                  {showTimePicker && (
                  <input
                    id="time-picker"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)} // Update time
                    className="time-input"
                  />
                )}
              </div>
      
                {/* <div className={`input-icon ${remainder ? "active" : ""}`} onClick={() => setRemainder(!remainder)}>
                  <button className="remainder-button">
                    <FaBell /> Remainder
                  </button>
                </div> */}
      
                <div className="input-icon">
                  <button className="add-task-button" onClick={handleSubmit}> Add Task </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="task-list">
            {taskList.map((task, index) => (
              <div key={index} className={`task-item ${task.completed ? "completed" : ""}`}>
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => handleCheckboxChange(index)} 
                  className="task-checkbox"
                />
                <p><strong>{task.task_name}</strong></p>
                <p>{new Date(task.task_date).toLocaleDateString()} | {task.task_time}</p>
                {/* {task.remainder && <p><FaBell/> Reminder Set</p>} */}
                <div className="task-actions">
                  <button onClick={() => handleEdit(index)}><FaEdit /></button>
                  <button onClick={() => handleDelete(index)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
          {/* {showTodayTasks && 
          <TodaysTasks 
             tasks={todayTasks} 
             onEdit={handleEdit} 
             onDelete={handleDelete} 
             onCheckboxChange={handleCheckboxChange} />} */}
             
             {showCompletedTasks && <CompletedTasks tasks={completedTasks}/>}
              {showPendingTasks && <PendingTasks onTaskCompletedUpdate={handleTaskCompletedUpdate}/>}
             {console.log("showTodayTasks:", showTodayTasks)}
             {showTodayTasks &&
                <TodaysTasks
                    userId={user?.id}
                    token={token}
                />}
          
          {showUpcomingTasks && user && <UpcomingTasks taskList={taskList} userId={user.id}/>}

        </div>
       
      );
}
     export default Taskhome;