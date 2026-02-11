import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./CreateIssue.css";

const CreateIssue = () => {
  const { repoId } = useParams(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!repoId) {
      setError("Invalid repository");
      return;
    }

    setLoading(true);
    setError("");

   try {
  const res = await fetch(
    `http://54.91.163.152:3002/repo/${repoId}/issues`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        userId: currentUser,
      }),
    }
  );


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create issue");
      }

      const createdIssue = await res.json();
      
      navigate(`/repo/${repoId}/issues/${createdIssue._id}`);
    } catch (err) {
      console.error("Error creating issue:", err);
      setError(err.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/repo/${repoId}/issues`);
  };

  return (
    <>
      <Navbar />

      <div className="create-issue-page">
        <div className="create-issue-container">
          <h1>New Issue</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="issue-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Issue title"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows="10"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create issue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIssue;