import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleIssuesClick = (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    
    if (!userId || userId === "undefined" || userId === "null") {
      alert("Please log in first");
      navigate("/login");
      return;
    }
    
    fetch(`http://localhost:3002/repo/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        const repos = data.repositories || [];
        if (repos.length > 0) {
          navigate(`/repo/${repos[0]._id}/issues`);
        } else {
          alert("Create a repository first to manage issues");
          navigate("/create");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Please create a repository first");
        navigate("/create");
      });
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <div className="logo-container">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>OurGit</h3>
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/repositories">
          <p>Repositories</p>
        </Link>

        <a href="#" onClick={handleIssuesClick}>
          <p>Issues</p>
        </a>

        <Link to="/create">
          <p>Create Repository</p>
        </Link>

        <Link to="/profile">
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;