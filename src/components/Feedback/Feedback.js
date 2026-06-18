import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Feedback = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [feedbackList, setFeedbackList] = useState([]); // Store all feedbacks
  const API_URL = "https://connecthive-connectbackend.onrender.com"; 
  useEffect(() => {
    
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    fetchFeedbacks(); // Fetch all feedbacks when page loads
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/feed`);
      const data = await response.json();
      setFeedbackList(data); // Update state with feedbacks
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !message) {
      alert("Please provide both a rating and a message.");
      return;
    }

    const feedbackData = { userId: user.id, rating, message };

    try {
      const response = await fetch(`${API_URL}/api/feedback/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Feedback submitted successfully!");
        setMessage("");
        setRating(null);
        fetchFeedbacks(); // Refresh the feedback list after submission
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <section className="bg-black text-white py-2 px-8">
 <div className="flex flex-col md:flex-row w-full gap-8 p-8 bg-black">
    {/* Left Side: Feedback Form Container */}
    <div className="w-full md:w-1/2 p-6 rounded-xl bg-gray-900 shadow-2xl border border-gray-700">
      
      <h3 className="text-3xl font-bold text-purple-400 mb-4">Leave us a feedback!</h3>
      <p className="text-sm text-gray-400">
        We’d love to hear from you! Share your thoughts and help us improve.
      </p>

      <div className="mt-6">
        <h4 className="text-2xl mb-4 font-semibold">Rate our website</h4>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 my-3">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={currentRating}
                    className="hidden"
                    onClick={() => setRating(currentRating)}
                  />
                  <FaStar
                    key={index}
                    size={30}
                    className="cursor-pointer"
                    color={currentRating <= (hover || rating) ? "#fbbf24" : "#ccc"}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
          <textarea
            className="w-full p-3 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>


          <button
            className="w-full mt-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>

    {/* Right Side: Feedback List Container */}
    <div className="w-full md:w-1/2 p-6 rounded-xl bg-gray-900 shadow-2xl border border-gray-700">
    <h3 className="text-3xl font-bold text-purple-500 mb-4">User Feedbacks</h3>
    <div className="overflow-y-auto max-h-[400px] border-t border-gray-700 
    ">

        {feedbackList.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No feedback yet.</p>
        ) : (
          feedbackList.map((feedback) => (
            <div key={feedback.id} className="p-3 border-b border-gray-700 bg-gray-800 rounded-lg shadow-md my-2">
              <p className="font-semibold text-purple-300">{feedback.name || "Anonymous"}</p>
              <div className="flex justify-center items-center my-1">

                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={20}
                    color={index < feedback.rating ? "#fbbf24" : "#ccc"}
                  />
                ))}
              </div>
              <p className="text-gray-400">{feedback.message}</p>
            </div>
          ))
        )}
      </div>
    </div>

  </div>
</section>

  
  );
};

export default Feedback;
