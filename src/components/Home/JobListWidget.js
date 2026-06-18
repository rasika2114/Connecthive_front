import { useState, useEffect, useDebugValue } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import styles from "./styles/joblistview.module.css"; 

const JobListWidget = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
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
    }, []);

    return(
      <div className={styles.jobListContainer}>
             <div className={styles.container}>
             <h2 className={styles.heading}>Latest Job Opportunities</h2>
      <div className={styles.jobList}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p><strong>Company : </strong> {job.company}</p>
              <p><strong>Location : </strong> {job.location}</p>
              <p><strong>Skills : </strong> {job.skills}</p>
              <p><strong>Experience : </strong> {job.experience} years</p>
              <p><strong>Salary : </strong> {job.salary}</p>
              <p><strong>Employeement Type : </strong> {job.employment_type}</p>
              <p><strong>Description : </strong> {job.description}</p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.applyButton}
                  onClick={() => navigate(`/referral/applynow/${job.id}`)}
                >
                  Apply now
                </button>
                <button 
                   className={styles.referralButton}
                   onClick={() => navigate(`/referral/requestform/${job.id}`)}
                >
                  Request Referral
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noJobs}>No jobs available</p>
        )}

      </div>
      </div>
      </div>

    );

};
   

export default JobListWidget;