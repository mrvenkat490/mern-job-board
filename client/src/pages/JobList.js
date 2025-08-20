// client/src/pages/JobList.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("❌ Error fetching jobs:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <Link to={`/jobs/${job._id}`}>
                {job.title} – {job.company} ({job.type})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;
