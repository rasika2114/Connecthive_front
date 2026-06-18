import React , {useState , useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from './styles/ApplicationPage.module.css'

const ApplicationPage = () => {
    const {jobId} = useParams();
    const [applications , setApplications] = useState([]);
    const [selectedApplicant , setSelectedApplicant] = useState(null);
    const API_URL = "https://connecthive-connectbackend.onrender.com";
    useEffect(() => {
        const fetchApplications = async () => {
            try{
                const response = await axios.get(`${API_URL}/api/application/job${jobId}`);
                setApplications(response.data);
            }
            catch(error){
                console.error("Error fetching applications:" , error);
            }
        }
        fetchApplications();
    } , [jobId]);

    return (
        <div className={styles.container}>
        <h2 className={styles.title}>Applications for Job ID : {jobId}</h2>
        <ul className={styles.appList}>
            {applications.map((app) => (
                <li key={app.id} className={styles.appItem}>
                    <div>
                        <p><strong>Company:</strong> {app.company_name}</p>
                        <p><strong>Position:</strong> {app.job_title}</p>
                        <p><strong>Applicant:</strong> {app.applicant_name}</p>
                    </div>
                    <button className={styles.viewProfileButton} onClick={() => setSelectedApplicant(app)}>View Profile</button>
                </li>
            ))}
        </ul>
            {selectedApplicant && (
                <div className={styles.profileModal}>
                    <div className={styles.profileContent}>
                        <h3 className={styles.profileTitle}>Applicant Profile</h3>
                        <p><strong>Full Name:</strong> {selectedApplicant.full_name}</p>
                        <p><strong>Email:</strong> {selectedApplicant.email}</p>
                        <p><strong>Phone:</strong> {selectedApplicant.phone}</p>
                        <p><strong>LinkedIn:</strong> <a href={selectedApplicant.linkedin} target="_blank" rel="noopener noreferrer">{selectedApplicant.linkedin}</a></p>
                        <p><strong>GitHub:</strong> <a href={selectedApplicant.github} target="_blank" rel="noopener noreferrer">{selectedApplicant.github}</a></p>
                        <p><strong>Job Title:</strong> {selectedApplicant.jobTitle}</p>
                        <p><strong>Experience:</strong> {selectedApplicant.experience} years</p>
                        <p><strong>Expected Salary:</strong> ${selectedApplicant.expectedSalary}</p>
                        {selectedApplicant.resume && (
                            <p>
                                <strong>Resume:</strong>
                                <a href={`https://connectbackend-p4db.onrender.com/uploads/${selectedApplicant.resume}`} target="_blank" rel="noopener noreferrer">Download Resume</a>
                            </p>
                        )}
                        {selectedApplicant.certifications && (
                            <p>
                                <strong>Certifications:</strong>
                                <a href={`https://connectbackend-p4db.onrender.com/uploads/${selectedApplicant.certifications}`} target="_blank" rel="noopener noreferrer">Download Certifications</a>
                            </p>
                        )}
                        <button className={styles.closeButton} onClick={() => setSelectedApplicant(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationPage;