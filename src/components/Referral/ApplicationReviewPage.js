import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import styles from './styles/ApplicationReview.module.css'; 

const ApplicationReviewPage = () => {
    const [groupedApplications, setGroupedApplications] = useState({});
    const [loading, setLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
   const API_URL = "https://connecthive-connectbackend.onrender.com"; 

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            console.log("User from localStorage:", storedUser);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && user?.id) {
            console.log("Second useEffect triggered. User:", user);
            console.log("Fetching applications for user ID:", user.id);
            const fetchApplications = async () => {
                try {
                    const response = await axios.get(
                        `${API_URL}/api/applicationReview/applicants/${user.id}`
                    );
                    // Group the applications by company and job title
                    const grouped = response.data.reduce((acc, app) => {
                        const key = `${app.company_name}-${app.job_title}`;
                        if (!acc[key]) {
                            acc[key] = {
                                company_name: app.company_name,
                                job_title: app.job_title,
                                job_id:app.job_id,
                                applicants: []
                            };
                        }
                        acc[key].applicants.push({
                            applicant_name: app.applicant_name,
                            applicant_id: app.applicant_id
                        });
                        return acc;
                    }, {});
                    setGroupedApplications(grouped);
                } catch (err) {
                    console.error(err);
                    setError('Failed to fetch applications.');
                } finally {
                    setFetchLoading(false);
                }
            };
            fetchApplications();
        } else if (!loading) {
            console.log("User ID not available or still loading.");
            setError('User not found.');
            setFetchLoading(false);
        }
    }, [user, loading]);

    if (fetchLoading) return <p>Loading Applications...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className={styles.container}>
        <h2 className={styles.title}>Application Review</h2>
        {Object.keys(groupedApplications).length === 0 ? (
            <p>No applications found.</p>
        ) : (
        <div className={styles.applicationList}>
            {Object.values(groupedApplications).map((group) => (
                <div key={`${group.company_name}-${group.job_title}`} className={styles.applicationGroup}>
                    <div className={styles.companyJobInfo}>
                        <h3>{group.company_name}</h3>
                        <p>{group.job_title}</p>
                        </div>
            <div className={styles.applicants}>
                {group.applicants.map((applicant) => (
                    <div key={applicant.applicant_id} className={styles.applicant}>
                        <p>{applicant.applicant_name}</p>
                        <button
    className={styles.viewProfileBtn}
    onClick={() => navigate(`/applicant/${applicant.applicant_id}`)}
>
    View Profile
</button>
<Link
    to = {`/referral-details/${applicant.applicant_id}/${group.job_id}`}
    className={styles.requestBtn}
>
    Requested Referral
</Link>
            </div>
        ))}
        
        </div>
        
        </div>))}
        
        </div>
        
        )}
        
        </div>
        
    );
        
        };
        
export default ApplicationReviewPage;