import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import ApplicationsPage from "./pages/ApplicationsPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/">Job Board</Link>
      </nav>

      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/admin/applications/:id" element={<ApplicationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
