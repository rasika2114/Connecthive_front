import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../User/editprofile.css';

// Editable List Component
function EditableList({ title, items, setItems, placeholder }) {
  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    setItems(items.map((item, i) => (i === index ? value : item)));
  };



  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-blue-400">{title}</h3>
      {items.map((item, index) => (
        <div key={index} className="mt-2 flex items-center">
          <input
            type="text"
            placeholder={placeholder}
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="input"
          />
          <button onClick={() => handleRemoveItem(index)} className="ml-2 text-red-500">✕</button>
        </div>
      ))}
      <button onClick={handleAddItem} className="mt-2 bg-gray-700 px-2 py-1 rounded">
        + Add {title}
      </button>
    </div>
  );
}

// Editable Licenses Component
function EditableLicenseList({ licenses, setLicenses }) {
  const handleAddLicense = () => {
    setLicenses([
      ...licenses,
      {
        title: "",
        issuing_organization: "",
        issue_date: "",
        expiration_date: "",
        credential_id: "",
        credential_url: "",
      },
    ]);
  };

  const handleRemoveLicense = (index) => {
    setLicenses(licenses.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setLicenses(
      licenses.map((license, i) =>
        i === index ? { ...license, [field]: value } : license
      )
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-blue-400">Licenses & Certifications</h3>
      {licenses.map((license, index) => (
        <div key={index} className="mt-4 p-4 border border-gray-600 rounded-lg">
          <input
            placeholder="Title"
            value={license.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="Issuing Organization"
            value={license.issuing_organization}
            onChange={(e) => handleChange(index, "issuing_organization", e.target.value)}
            className="input mb-2"
          />
          <input
            type="date"
            placeholder="Issue Date"
            value={license.issue_date}
            onChange={(e) => handleChange(index, "issue_date", e.target.value)}
            className="input mb-2"
          />
          <input
            type="date"
            placeholder="Expiration Date"
            value={license.expiration_date}
            onChange={(e) => handleChange(index, "expiration_date", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="Credential ID"
            value={license.credential_id}
            onChange={(e) => handleChange(index, "credential_id", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="Credential URL"
            value={license.credential_url}
            onChange={(e) => handleChange(index, "credential_url", e.target.value)}
            className="input mb-2"
          />
          <button onClick={() => handleRemoveLicense(index)} className="ml-2 text-red-500">
            ✕ Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddLicense} className="mt-2 bg-gray-700 px-2 py-1 rounded">
        + Add License
      </button>
    </div>
  );
}

// Editable Education Component
function EditableEducationList({ education, setEducation }) {
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        field_of_study: "",
        start_year: "",
        end_year: "",
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setEducation(
      education.map((education, i) =>
        i === index ? { ...education, [field]: value } : education
      )
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-blue-400">Education</h3>
      {education.map((edu, index) => (
        <div key={index} className="mt-4 p-4 border border-gray-600 rounded-lg">
          <input
            placeholder="institution"
            value={edu.institution}
            onChange={(e) => handleChange(index, "institution", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="degree"
            value={edu.degree}
            onChange={(e) => handleChange(index, "degree", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="field_of_study"
            value={edu.field_of_study}
            onChange={(e) => handleChange(index, "field_of_study", e.target.value)}
            className="input mb-2"
          />
          <input
            type="year"
            placeholder="start_year"
            value={edu.start_year}
            onChange={(e) => handleChange(index, "start_year", e.target.value)}
            className="input mb-2"
          />
          <input
            type="year"
            placeholder="end_year"
            value={edu.end_year}
            onChange={(e) => handleChange(index, "end_year", e.target.value)}
            className="input mb-2"
          />
          <button onClick={() => handleRemoveEducation(index)} className="ml-2 text-red-500">
            ✕ Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddEducation} className="mt-2 bg-gray-700 px-2 py-1 rounded">
        + Add Education
      </button>
    </div>
  );
}

// Editable Experience Component
function EditableExperienceList({ Experience, setExperience }) {
  const handleAddExperience = () => {
    setExperience([
      ...Experience,
      {
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperience(Experience.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setExperience(
      Experience.map((Experience, i) =>
        i === index ? { ...Experience, [field]: value } : Experience
      )
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-blue-400">Experience</h3>
      {Experience.map((Experience, index) => (
        <div key={index} className="mt-4 p-4 border border-gray-600 rounded-lg">
          <input
            placeholder="Job Title"
            value={Experience.job_title}
            onChange={(e) => handleChange(index, "job_title", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="Company"
            value={Experience.company}
            onChange={(e) => handleChange(index, "company", e.target.value)}
            className="input mb-2"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={Experience.start_date}
            onChange={(e) => handleChange(index, "start_date", e.target.value)}
            className="input mb-2"
          />
          <input
            type="date"
            placeholder="End Date"
            value={Experience.end_date}
            onChange={(e) => handleChange(index, "end_date", e.target.value)}
            className="input mb-2"
          />
          <input
            placeholder="Description"
            value={Experience.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            className="input mb-2"
          />
          <button onClick={() => handleRemoveExperience(index)} className="ml-2 text-red-500">
            ✕ Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddExperience} className="mt-2 bg-gray-700 px-2 py-1 rounded">
        + Add Experience
      </button>
    </div>
  );
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const userId = user?.id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [licenses, setLicenses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [education,setEducation] = useState([]);
  const [Experience,setExperience]=useState([]);
  useEffect(() => {
    fetch(`/api/get_profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile);
        setLicenses(data.licenses);
        setSkills(data.skills);
        setInterests(data.interests);
        setEducation(data.education);
        setExperience(data.experience);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    try {
        // If everything is valid, send data to the backend
        const profileResponse = await fetch("https://connecthive-connectbackend.onrender.com/api/user/add_profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, ...profile }),
        });
    }catch(e){
      alert("Error Updating Profile");
    }

    try{   // Add licenses
        await Promise.all(
            licenses.map((license) =>
                fetch("https://connecthive-connectbackend.onrender.com/api/user/add_license", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, ...license }),
                })
            )
        );
    }catch(e){
      alert("Error Updating Profile")
    }
     
    try{
        // Add education
        await Promise.all(
            education.map((edu) =>
                fetch("https://connecthive-connectbackend.onrender.com/api/user/add_education", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, ...edu }),
                })
            )
        );
    }catch(e){
      alert("Error Updating Profile")
    }


    try{

        // Add experience
        await Promise.all(
            Experience.map((exp) =>
                fetch("https://connecthive-connectbackend.onrender.com/api/user/add_experience", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, ...exp }),
                })
            )
        );

    }catch(e){
      alert("Error Updating Profile")
    }

    try{

        // Add skills
        await Promise.all(
            skills.map((skill) =>
                fetch("https://connecthive-connectbackend.onrender.com/api/user/add_skill", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, skill_name: skill }),
                })
            )
        );
    }catch(e){
      alert("Error Updating Profile")
    }


    try{
        // Add interests
        await Promise.all(
            interests.map((interest) =>
                fetch("https://connecthive-connectbackend.onrender.com/api/user/add_interest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, interest_name: interest }),
                })
            )
        );

    }catch(e){
      alert("Error Updating Profile")
    }
        navigate("/user");
};


  return (
    <div className="edit-profile-container">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={profile.name} onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" value={profile.email} onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" value={profile.phone} onChange={handleChange} className="input" />
          <textarea name="summary" placeholder="Summary" value={profile.summary} onChange={handleChange} className="input" />
        </div>

        <EditableLicenseList licenses={licenses} setLicenses={setLicenses} />
        <EditableEducationList education={education} setEducation={setEducation} />
        <EditableExperienceList Experience={Experience} setExperience={setExperience} />
        <EditableList title="Skills" items={skills} setItems={setSkills} placeholder="Add Skill" />
        <EditableList title="Interests" items={interests} setItems={setInterests} placeholder="Add Interest" />

        <button onClick={handleSubmit} className="mt-6 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
}