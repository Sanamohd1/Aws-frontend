import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar.jsx";
import "./RepoList.css";

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  const currentUserID = localStorage.getItem("userId");

  const fetchRepos = async () => {
    if (!currentUserID || currentUserID === "undefined" || currentUserID === "null") {
      console.error("Invalid user ID");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/repo/user/${currentUserID}`);
      setRepos(response.data.repositories);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleStar = async (repoID) => {
    try {
      await axios.patch(`${apiUrl}/repo/star/${repoID}`, {
        userID: currentUserID,
      });
      fetchRepos();
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="repolist-page">
      <Navbar />
      <main className="repolist-container">
        <header className="repolist-header">
          <h2>Your Repositories</h2>
          <Link to="/create" className="new-repo-btn">New</Link>
        </header>

        <div className="repolist-search">
          <input
            type="text"
            placeholder="Find a repository..."
            value={searchQuery}                 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <section className="repolist-items">
          {loading ? (
            <p>Loading repositories...</p>
          ) : filteredRepos.length > 0 ? (  
            filteredRepos.map((repo) => (
              <div key={repo._id} className="repo-item">
                <div className="repo-item-main">
                  <div className="repo-item-title">
                    <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                    <span className="visibility-badge">
                      {repo.visibility ? "Public" : "Private"}
                    </span>
                  </div>

                  {repo.description && (
                    <p className="repo-item-desc">{repo.description}</p>
                  )}

                  <div className="repo-item-meta">
                    <div className="meta-left">
                      <span className="lang-dot"></span>
                      <span>{repo.language || "JavaScript"}</span>
                      <span>Updated recently</span>
                    </div>

                    <div className="meta-right">
                      <button
                        onClick={() => handleStar(repo._id)}
                        className={`star-btn ${
                          repo.stars?.includes(currentUserID) ? "starred" : ""
                        }`}
                      >
                        {repo.stars?.includes(currentUserID)
                          ? "★ Unstar"
                          : "☆ Star"}
                        {repo.stars?.length > 0 && (
                          <span className="star-count">
                            {repo.stars.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default RepoList;