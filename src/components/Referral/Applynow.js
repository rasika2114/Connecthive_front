import React, { useState , useEffect} from "react";
import styles from './styles/applyNow.module.css';
import axios from "axios";
import { useParams } from "react-router-dom";

const ApplyNowForm = ({ closeModal}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [userId , setUserId] = useState("");
    const {jobId} = useParams();
    const API_URL = "https://connecthive-connectbackend.onrender.com";
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        resume: null,
        jobTitle: "",
        experience: "",
        expectedSalary: "",
        certifications: null
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        for(const key in formData){
            form.append(key , formData[key]);
        }
        console.log("JobId before append:", jobId);
        form.append('job_id' , jobId);
        form.append('applicant_id' , userId);
        console.log("Job ID:", jobId);
        console.log("FormData:", form);
        try{
            await axios.post(`${API_URL}/api/application/apply` , form , {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Application submitted successfully!");
            closeModal();
        } catch(error) {
            console.error("Error in submitting the application : " , error);
            // alert("Application failed");
        }
    };

    return (
        <div className={styles.modal}>
            <h2 className={styles.title}>Apply for Job</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required className={styles.input}/>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className={styles.input}/>
                <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required className={styles.input}/>
                <input type="url" name="linkedin" placeholder="LinkedIn Profile" onChange={handleChange} className={styles.input}/>
                <input type="url" name="github" placeholder="Github Profile" onChange={handleChange} className={styles.input}/>
                <input type="text" name="jobTitle" placeholder="Current Job Title (Optional)" onChange={handleChange} className={styles.input}/>
                <input type="number" name="experience" placeholder="Years of Experience (Optional)" onChange={handleChange} className={styles.input}/>
                <input type="number" name="expectedSalary" placeholder="Expected Salary (Optional)" onChange={handleChange} className={styles.input}/>
                <input type="file" name="resume" onChange={handleFileChange} required className={styles.fileInput}/>
                <input type="file" name="certifications" onChange={handleFileChange} className={styles.fileInput}/>
                <button type="submit" className={styles.submitButton}>Submit Application</button>
            </form>
            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
        </div>
    );
};

export default ApplyNowForm;
