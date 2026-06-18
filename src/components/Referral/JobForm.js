import { useState, useEffect } from "react"; 
import { useNavigate , useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles/dark-theme.module.css";

const JobForm = ({ fetchJobs }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [job, setJob] = useState({
        title: "",
        company: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
        employment_type: "",
        description: "",
        apply_link: "",
        user_id: null, 
    });

    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
            setJob((prevJob) => ({
                ...prevJob,
                user_id: storedUser.id, 
            }));
        }
    
        if(location.state && location.state.job && location.state.editing){
            const jobToEdit = location.state.job;
            setJob(jobToEdit);
            setEditing(true);
            setEditId(jobToEdit.id);
        }
    } , [location.state]);

    
    const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value });

    const submitJob = async (e) => {
        e.preventDefault();
        
        if (!job.user_id) {
            alert("User ID is missing. Please log in again.");
            return;
        }

        try {
            let response;
            if (editing) {
                response = await axios.put(`${API_URL}/api/jobs/update/${editId}`, job);
            } else {
                response = await axios.post(`${API_URL}/api/jobs/add`, job);
            }
            alert(response.data.message);
            setJob({ 
                title: "", company: "", location: "", skills: "", experience: "", 
                salary: "", employment_type: "", description: "", apply_link: "", 
                user_id: user.id, // Reset with the correct user_id
            });
            fetchJobs();
            setEditing(false);
            navigate("/referral/joblist");
        } catch (error) {
            console.error("Axios Error:", error.response?.data || error.message);
            // alert(`Error: ${error.response?.data?.error || "Server Error"}`);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>{editing ? "Edit Job" : "Post a Job"}</h2>
            <form onSubmit={submitJob}>
                <input type="text" name="title" className={styles.input} placeholder="Job Title" value={job.title} onChange={handleChange} required />
                <input type="text" name="company" className={styles.input} placeholder="Company Name" value={job.company} onChange={handleChange} required />
                <input type="text" name="location" className={styles.input} placeholder="Location" value={job.location} onChange={handleChange} required />
                <input type="text" name="skills" className={styles.input} placeholder="Required Skills" value={job.skills} onChange={handleChange} required />
                <input type="number" name="experience" className={styles.input} placeholder="Experience (years)" value={job.experience} onChange={handleChange} required />
                <input type="number" name="salary" className={styles.input} placeholder="Salary (per year)" value={job.salary} onChange={handleChange} required />
                <select name="employment_type" className={styles.input} value={job.employment_type} onChange={handleChange} required>
                    <option value="">Select Employment Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                </select>
                <textarea name="description" className={styles.input} placeholder="Job Description" value={job.description} onChange={handleChange} required />
                <input type="url" name="apply_link" className={styles.input} placeholder="Apply Link" value={job.apply_link} onChange={handleChange} required />
                <button type="submit" className={styles.button}>{editing ? "Update Job" : "Post Job"}</button>
            </form>
            <button onClick={() => navigate("/referral/joblist")} className={styles.button}>Show Jobs</button>
        </div>
    );
};

export default JobForm;
