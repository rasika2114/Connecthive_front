import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/ReferralReview.module.css';

const ReferralDetailsPage = () => {
  const { applicant_id, job_id } = useParams();
  const navigate = useNavigate();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const API_URL = "https://connecthive-connectbackend.onrender.com";
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reviewReferralRequest/referral-request/${applicant_id}/${job_id}`);
        setReferralData(res.data);
      } catch (err) {
        setError('Could not fetch referral data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [applicant_id, job_id]);

  const handleAcceptReferral = async () => {
    setAccepting(true);
    try {
      const res = await axios.put(`${API_URL}/api/referralRequest/accept`, {
        user_id: applicant_id,
        job_id: job_id,
      });

      // Update the local state with new status
      setReferralData(prev => ({ ...prev, status: 'Accepted' }));
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Failed to accept referral.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!referralData) return <div className={styles.error}>No data found.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Referral Request Details</h1>
      <div className={styles.detailBox}>
        <p><strong>Name:</strong> {referralData.name}</p>
        <p><strong>Email:</strong> {referralData.email}</p>
        <p><strong>Message:</strong> {referralData.message || 'No message provided'}</p>
        <p><strong>Status:</strong> {referralData.status}</p>
        <p><strong>Submitted on:</strong> {new Date(referralData.created_at).toLocaleString()}</p>
        <p>
          <strong>Resume:</strong>{' '}
          <a href={`${API_URL}/${referralData.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a>
        </p>
      </div>


      {referralData.status !== 'Accepted' && (
        <button
          className={styles.acceptBtn}
          onClick={handleAcceptReferral}
          disabled={accepting}
        >
          {accepting ? 'Accepting...' : 'Accept Referral'}
        </button>
      )}

      <button className={styles.backBtn} onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default ReferralDetailsPage;
