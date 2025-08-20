// client/src/pages/ApplicationsPage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ApplicationsPage() {
  const { id } = useParams(); // jobId from URL
  const [applications, setApplications] = useState([]);

  // Fetch applications for a job
  useEffect(() => {
    axios
      .get(`http://localhost:5000/applications/${id}`)
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("❌ Error fetching applications:", err));
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications for Job {id}</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Resume</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>
                  <a
                    href={`http://localhost:5000/applications/download/${app._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Resume
                  </a>
                </td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApplicationsPage;
