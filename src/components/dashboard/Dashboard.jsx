import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredSuggestedRepositories, setFilteredSuggestedRepositories] =
    useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        if (!userId || userId === "undefined" || userId === "null") {
          console.error("Invalid user ID in localStorage:", userId);
          return;
        }

       const response = await fetch(
  `http://http://52.91.90.194:3002/repo/user/${userId}`
);


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
  try {
    const response = await fetch("http://52.91.90.194:3002/repo/all");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching suggested repositories:", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
      setFilteredSuggestedRepositories(suggestedRepositories);
    } else {
      const query = searchQuery.toLowerCase();

      const filteredRepos = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(query)
      );

      const filteredSuggested = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(query)
      );

      setSearchResults(filteredRepos);
      setFilteredSuggestedRepositories(filteredSuggested);
    }
  }, [searchQuery, repositories, suggestedRepositories]);

  const handleCreateIssue = () => {
   
        if (repositories.length > 0) {
      const repoId = repositories[0]._id;
      navigate(`/repo/${repoId}/issues/new`);
    } else {
      alert("Please create a repository first before creating an issue");
      navigate("/create");
    }
  };

  return (
    <>
      <Navbar />

      <section id="dashboard">
        {/* LEFT SIDEBAR */}
        <aside>
          <h3>Suggested Repositories</h3>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredSuggestedRepositories.length > 0 ? (
            filteredSuggestedRepositories.map((repo) => (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          ) : (
            <p>No suggested repositories found</p>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main>
          <h2>Home</h2>
          {/* Ask Anything */}
          <div className="ask-box">
            <p className="ask-placeholder">Ask anything</p>

            <div className="ask-actions">
              <button className="ask-btn primary">💬 Ask</button>
              <button className="ask-btn">＋</button>
              <button className="send-btn">➤</button>
            </div>
          </div>

          {/* Quick Actions */}
          <button className="quick">Task</button>
          <button 
            className="quick" 
            onClick={handleCreateIssue}
          >
            Create issue
          </button>
          <button className="quick">Write code</button>
          <button className="quick">Git</button>
          <button className="quick">Pull requests</button>

          {/* Feed */}
          <div className="feed-header">
            <h3>Feed</h3>
            <button className="filter-btn">Filter</button>
          </div>

          {/* Trending */}
          <div className="feed-card">
            <p className="feed-title">
              📈 Trending repositories · <span>See more</span>
            </p>
          </div>

          <div className="repo-row">
            <div>
              <strong>thedotmack/claude-mem</strong>
              <p className="repo-desc">
                A Claude Code plugin that automatically captures everything
                during your coding sessions.
              </p>
              <span className="repo-meta">● TypeScript · ★ 21.8k</span>
            </div>
          </div>

          <div className="repo-row">
            <div>
              <strong>anthropics/knowledge-work-plugins</strong>
              <p className="repo-desc">
                Open source plugins for knowledge workers using Claude.
              </p>
              <span className="repo-meta">● Python · ★ 3.1k</span>
            </div>
          </div>

          {/* Recommended */}
          <div className="feed-card">
            <p className="feed-title">⭐ Recommended for you</p>

            <div className="repo-row">
              <div>
                <strong>WebTech/React_Backend_Dashboard</strong>
                <p className="repo-desc">
                  Backend dashboard project built with React and Node.js.
                </p>
                <span className="repo-meta">● JavaScript · ★ 8</span>
              </div>
            </div>
          </div>
        </main>

        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;