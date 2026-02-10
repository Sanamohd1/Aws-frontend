import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "./list.css";

const IssueList = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [repository, setRepository] = useState(null);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("IssueList mounted");
    console.log("repoId from params:", repoId);
    console.log("Current URL:", window.location.pathname);
    
    if (!repoId) {
      console.error("❌ No repoId found! Redirecting to dashboard...");
      setLoading(false);
      // Redirect to dashboard if no repoId
      setTimeout(() => navigate("/dashboard"), 2000);
      return;
    }
    
    fetchRepository();
    fetchIssues();
  }, [repoId, filter]);

  const fetchRepository = async () => {
    try {
      const res = await fetch(`http://localhost:3002/repo/${repoId}`);
      const data = await res.json();
      console.log("Repository fetched:", data);
      setRepository(data);
    } catch (err) {
      console.error("Error fetching repository:", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const url = `http://localhost:3002/repo/${repoId}/issues?status=${filter}`;
      console.log("Fetching issues from:", url);
      
      const res = await fetch(url);
      const data = await res.json();
      console.log("Issues fetched:", data);
      setIssues(data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!repoId) {
    return (
      <>
        <Navbar />
        <div className="error" style={{ color: "white", padding: "50px", textAlign: "center" }}>
          <h2>Invalid URL</h2>
          <p>No repository ID found in the URL.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="issue-list-page">
        <div className="issue-list-header">
          <div className="breadcrumb">
            <span
              className="repo-link"
              onClick={() => navigate(`/repo/${repoId}`)}
            >
              {repository?.name || "Loading..."}
            </span>
            <span className="separator">/</span>
            <span>Issues</span>
          </div>

          <button
            className="new-issue-btn"
            onClick={() => navigate(`/repo/${repoId}/issues/new`)}
          >
            New issue
          </button>
        </div>

        <div className="issues-container">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue._id}
                className="issue-item"
                onClick={() =>
                  navigate(`/repo/${repoId}/issues/${issue._id}`)
                }
              >
                <h3>{issue.title}</h3>
                <p className="issue-meta">
                  #{issue.issueNumber} · {issue.status}
                </p>
              </div>
            ))
          ) : (
            <div className="no-issues">
              <p>No issues found</p>
             
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IssueList;