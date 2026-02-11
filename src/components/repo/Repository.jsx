import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./Repository.css";

const Repository = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");

  const storedUserId = localStorage.getItem("userId");
  const currentUserID =
    storedUserId && storedUserId !== "undefined" && storedUserId !== "null"
      ? storedUserId
      : null;

const apiUrl =
  import.meta.env.VITE_API_URL || "http://52.91.90.194:3002";

  useEffect(() => {
    if (!id || id === "undefined" || id === "null") {
      console.error("Invalid repository id:", id);
      setLoading(false);
      return;
    }
    fetchRepository();
  }, [id]);

  const fetchRepository = async () => {
    try {
      const response = await fetch(`${apiUrl}/repo/${id}`);
      if (!response.ok) throw new Error("Repository not found");
      const data = await response.json();
      setRepository(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error("Error fetching repository:", err);
      setRepository(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!currentUserID) {
      alert("Please login to star repositories");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/repo/star/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: currentUserID }),
      });

      if (!response.ok) throw new Error("Failed to star repository");
      fetchRepository();
    } catch (err) {
      console.error("Error starring repository:", err);
    }
  };

  const handleDelete = async () => {
    if (!currentUserID) {
      alert("Please login to delete repositories");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/repo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: currentUserID }),
      });

      if (!response.ok) throw new Error("Failed to delete repository");

      alert("Repository deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("You are not authorized to delete this repository");
    }
  };

  const handleIssuesClick = () => {
    navigate(`/repo/${id}/issues`);
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );

  if (!repository)
    return (
      <>
        <Navbar />
        <div className="error">Repository not found</div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="repository-page">
        <div className="repo-header">
          <div className="repo-title-section">
            <h1 className="repo-title">
              <span className="repo-owner">
                {repository.owner?.username || "user"}
              </span>
              <span className="separator">/</span>
              <span className="repo-name-title">{repository.name}</span>
            </h1>
            <span className="repo-visibility">
              {repository.visibility ? "Public" : "Private"}
            </span>
          </div>

          <div className="repo-actions">
            <button
              className={`action-btn ${
                repository.stars?.includes(currentUserID) ? "starred" : ""
              }`}
              onClick={handleStar}
            >
              <span className="icon">
                {repository.stars?.includes(currentUserID) ? "★" : "☆"}
              </span>
              {repository.stars?.includes(currentUserID) ? "Unstar" : "Star"}
              <span className="count">{repository.stars?.length || 0}</span>
            </button>

            <button className="action-btn">
              <span className="icon">⑂</span> Fork
              <span className="count">0</span>
            </button>

            {/* 🗑️ DELETE BUTTON (OWNER ONLY) */}
            {(repository.owner?._id || repository.owner) === currentUserID && (
              <button className="action-btn danger" onClick={handleDelete}>
                <span className="icon">🗑️</span> Delete
              </button>
            )}
          </div>
        </div>

        <nav className="repo-nav">
          <button
            className={activeTab === "code" ? "active" : ""}
            onClick={() => setActiveTab("code")}
          >
            <span className="icon">{"</>"}</span> Code
          </button>

          <button
            className={activeTab === "issues" ? "active" : ""}
            onClick={handleIssuesClick}
          >
            <span className="icon">●</span> Issues
          </button>
        </nav>

        <div className="repo-content">
          <main className="repo-main">
            {activeTab === "code" && (
              <div className="code-section">
                <div className="file-explorer">
                  <div className="file-header">
                    <div className="commit-message">
                      <img
                        src="https://github.com/identicons/user.png"
                        alt="User"
                        className="author-avatar"
                      />
                      <span className="commit-text">Update project files</span>
                    </div>
                    <div className="commit-meta">
                      <span className="commit-time">Recently</span>
                    </div>
                  </div>

                  <div className="files-list">
                    {repository.content && repository.content.length > 0 ? (
                      repository.content.map((file, index) => (
                        <div key={index} className="file-item">
                          <span className="file-icon">📄</span>
                          <span className="file-name">{file}</span>
                          <span className="file-message">Initial commit</span>
                          <span className="file-time">Recently</span>
                        </div>
                      ))
                    ) : (
                      <div className="file-item empty">
                        No files in this repository
                      </div>
                    )}
                  </div>
                </div>

                <div className="readme-section">
                  <div className="readme-header">
                    <span className="icon"></span>
                    <span>README.md</span>
                  </div>
                  <div className="readme-content">
                    <h1>{repository.name}</h1>
                    <br />
                    <p>
                      {repository.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>

          <aside className="repo-sidebar">
            <div className="about-section">
              <h3>About</h3>
              <p className="repo-description">
                {repository.description || "No description provided"}
              </p>
            </div>

            <br />

            <div className="language-section">
              <h3>Languages</h3>
              <div className="language-item">
                <span
                  className="language-dot"
                  style={{ backgroundColor: "#f1e05a" }}
                ></span>
                <span className="language-name">JavaScript</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Repository;