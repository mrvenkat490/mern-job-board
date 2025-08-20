// client/src/pages/JobDetail.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function JobDetail() {
  const { id } = useParams(); // jobId
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", resume: null });

  // Fetch job details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("❌ Error fetching job:", err));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, resume: e.target.files[0] });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("resume", form.resume);

    try {
      await axios.post(`http://localhost:5000/applications/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Application submitted successfully!");
      setForm({ name: "", email: "", resume: null });
    } catch (err) {
      alert(err.response?.data?.error || "❌ Something went wrong");
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p>{job.description}</p>

      <h3>Apply for this Job</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input type="file" name="resume" onChange={handleFile} required />
        <button type="submit">Submit Application</button>
      </form>

      <hr />

      {/* ✅ View Applications Button */}
      <Link to={`/admin/applications/${id}`}>
        <button style={{ marginTop: "20px", background: "#444", color: "#fff", padding: "10px 15px" }}>
          View Applications (Admin)
        </button>
      </Link>
    </div>
  );
}

export default JobDetail;
