import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./issue.css";

const Issue = () => {
  const { repoId, issueId } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [repository, setRepository] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem("userId");

  useEffect(() => {
    if (!repoId || !issueId) {
      setLoading(false);
      return;
    }

    fetchIssue();
    fetchRepository();
    fetchComments();
  }, [repoId, issueId]);

  const fetchIssue = async () => {
    try {
      const res = await fetch(
        `http://54.91.163.152:3002/repo/${repoId}/issues/${issueId}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIssue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepository = async () => {
    try {
      const res = await fetch(
        `http://54.91.163.152:3002/repo/${repoId}`
      );
      const data = await res.json();
      setRepository(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://54.91.163.152:3002/repo/${repoId}/issues/${issueId}/comments`
      );
      if (!res.ok) return;
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await fetch(
      `http://54.91.163.152:3002/repo/${repoId}/issues/${issueId}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser,
          content: newComment,
        }),
      }
    );

    if (res.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleCloseIssue = async () => {
    await fetch(
      `http://54.91.163.152:3002/repo/${repoId}/issues/${issueId}/close`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser }),
      }
    );
    fetchIssue();
  };

  const handleReopenIssue = async () => {
    await fetch(
      `http://54.91.163.152:3002/repo/${repoId}/issues/${issueId}/reopen`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser }),
      }
    );
    fetchIssue();
  };

  const formatDate = (dateString) => {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading issue...</div>
      </>
    );
  }

  if (!issue) {
    return (
      <>
        <Navbar />
        <div className="error">Issue not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="issue-page">
        <div className="issue-container">
          <div className="issue-header">
            <div className="breadcrumb">
              <span onClick={() => navigate(`/repo/${repoId}`)}>
                {repository?.name}
              </span>
              <span>/</span>
              <span onClick={() => navigate(`/repo/${repoId}/issues`)}>
                Issues
              </span>
              <span>/</span>
              <span>#{issue.issueNumber}</span>
            </div>

            <h1 className="issue-title">{issue.title}</h1>

            <div className="issue-meta">
              <span className={`status-badge ${issue.status}`}>
                {issue.status}
              </span>
              <span>
                {issue.createdBy?.username} opened this issue{" "}
                {formatDate(issue.createdAt)}
              </span>
            </div>
          </div>

          <div className="issue-content-wrapper">
            <div className="issue-main">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-avatar">
                    <div className="avatar-circle" />
                  </div>
                  <div className="timeline-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {issue.createdBy?.username}
                      </span>
                      <span>{formatDate(issue.createdAt)}</span>
                    </div>
                    <div className="comment-body">
                      {issue.description}
                    </div>
                  </div>
                </div>

                {comments.map((c) => (
                  <div key={c._id} className="timeline-item">
                    <div className="timeline-avatar">
                      <div className="avatar-circle" />
                    </div>
                    <div className="timeline-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {c.userId?.username}
                        </span>
                        <span>{formatDate(c.createdAt)}</span>
                      </div>
                      <div className="comment-body">{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-comment-section">
                <div className="timeline-item">
                  <div className="timeline-avatar">
                    <div className="avatar-circle" />
                  </div>
                  <div className="timeline-content">
                    <form onSubmit={handleAddComment}>
                      <textarea
                        className="comment-textarea"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <div className="comment-actions">
                        {issue.status === "open" ? (
                          <button type="button" onClick={handleCloseIssue}>
                            Close issue
                          </button>
                        ) : (
                          <button type="button" onClick={handleReopenIssue}>
                            Reopen issue
                          </button>
                        )}
                        <button type="submit">comment</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Issue;
