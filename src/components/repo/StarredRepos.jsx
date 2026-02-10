import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar.jsx";

const StarredRepos = () => {
  const [starredRepos, setStarredRepos] = useState([]);

  useEffect(() => {
    const fetchStarred = async () => {
      const userID = localStorage.getItem("userId");
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      try {
        // Hits the new GET route for starred repos
        const response = await axios.get(`${apiUrl}/repo/starred/${userID}`);
        setStarredRepos(response.data);
      } catch (err) {
        console.error("Error fetching starred repos", err);
      }
    };
    fetchStarred();
  }, []);

  return (
    <div className="starred-page">
      <Navbar />
      <div className="repolist-container">
        <h2>Your Starred Repositories</h2>
        {starredRepos.map(repo => (
          <div key={repo._id} className="repo-item">
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarredRepos;