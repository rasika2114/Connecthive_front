import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import styles from "./styles/darkUI.module.css"; 
import { FaLeaf } from "react-icons/fa";

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [user , setUser] = useState(null);
    const API_URL = "https://connecthive-connectbackend.onrender.com";
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/jobs/`);
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if(storedUser){
            setUser(storedUser);
        }
    }, []);

    const handleDelete = async (jobId) => {
        try{
            await axios.delete(`${API_URL}/api/jobs/delete/${jobId}`);
            setJobs(jobs.filter((job) => job.id !== jobId ));
            // alert("Job deleted successfully");
        }
        catch(error){
            console.error("Error deleting job:" , error);
            alert("Failed to delete job");
        }
    }

    const handleEdit = (job) => {
        navigate(`/referral/form` , {state: {job , editing: true}});
    }



    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Job Listings</h2>

                <button className={styles.goBack} onClick={() => navigate("/referral/form")}>
                    Go Back
                </button>

                <div className={styles.jobList}>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <h3 className={styles.jobTitle}>{job.title}</h3>
                                <p><strong>Company:</strong> {job.company}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Skills:</strong> {job.skills}</p>
                                <p><strong>Experience:</strong> {job.experience} years</p>
                                <p><strong>Salary:</strong> {job.salary}</p>
                                <p><strong>Employment Type:</strong> {job.employment_type}</p>
                                <p><strong>Description:</strong> {job.description}</p>
                                <div className={styles.buttonContainer}>

                                    {user && user.id === job.user_id && (
                                        <>
                                          <button className={styles.referralButton} onClick={() => handleEdit(job)}>Edit</button>
                                          <button className={styles.referralButton} onClick={() => handleDelete(job.id)}>Delete</button>
                                        </>
                                    )}
                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noJobs}>No jobs available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobList;