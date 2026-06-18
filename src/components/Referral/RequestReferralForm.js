import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './styles/referral.module.css';
import { useNavigate, useParams } from "react-router-dom";

const RequestReferralForm = ({closeModal , handleReferralSubmit }) => {
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        resume: null,
        message: ""
    });

    const [uploadError, setUploadError] = useState(null);
    const {jobId} = useParams();
    const [userId , setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if(storedUser && storedUser.id){
            setUserId(storedUser.id);
        }
    } , []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError(null);
        if(!jobId || !userId){
            console.error("Job ID or User ID is undefined : " , jobId , userId);
            alert("Error: Job ID or User ID is missing");
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("job_id", jobId);
        formDataToSend.append("user_id", userId);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("resume", formData.resume);
        formDataToSend.append("message", formData.message);
        console.log("jobId:", jobId);
        console.log("userId:", userId);
        try {
            const response = await axios.post(`${API_URL}/api/referralRequest/request`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.status === 200) {
                alert("Referral request submitted successfully!");
                if(closeModal){
                    closeModal();
                }else{
                    navigate(-1);
                }
                if(handleReferralSubmit){
                    handleReferralSubmit(jobId , userId);
                }
            } else {
                setUploadError("Failed to submit referral request");
                alert("Failed to submit referral request!");
            }

        } catch (error) {
            console.error("Error submitting referral:", error);
            setUploadError("An unexpected error occurred");
            alert("Failed to submit referral request!");
        }
    };

    return (
        <div className={styles.modal}>
            <h2 className={styles.title}>Request Referral</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required className={styles.input} />
                <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required className={styles.input} />
                <textarea name="message" placeholder="Write a message....." onChange={handleChange} required className={styles.textarea}></textarea>
                <input type="file" name="resume" onChange={handleFileChange} required className={styles.fileInput} />
                <button type="submit" className={styles.submitButton}>Submit Request</button>
            </form>
           {closeModal && <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>}
           {!closeModal && <button onClick={() => navigate(-1)} className={styles.cancelButton}>Go Back</button>}
        </div>
    );
};

export default RequestReferralForm;