import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext.jsx";

import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Repository from "./components/repo/Repository.jsx";

import Issue from "./components/issue/issues.jsx"; 
import IssueList from "./components/issue/IssueList.jsx";
import CreateIssue from "./components/issue/CreateIssue.jsx";

import RepoList from "./components/repo/RepoList.jsx";
import RepositoryCreation from "./components/repo/RepositoryCreation.jsx";
import StarredRepos from "./components/repo/StarredRepos.jsx";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";

/* CSS imports */
import "./components/issue/issue.css";
import "./components/issue/list.css";
import "./components/issue/CreateIssue.css";
import "./components/repo/RepositoryCreation.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Repositories */}
          <Route path="/repositories" element={<RepoList />} />
          <Route path="/create" element={<RepositoryCreation />} />
          <Route path="/repo/:id" element={<Repository />} />
          <Route path="/starred" element={<StarredRepos />} />

          {/* Issues  */}
          <Route path="/repo/:repoId/issues" element={<IssueList />} />
          <Route path="/repo/:repoId/issues/new" element={<CreateIssue />} />
          <Route path="/repo/:repoId/issues/:issueId" element={<Issue />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ color: "white", padding: "50px" }}>
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);