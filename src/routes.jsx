import { useRoutes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/user/Profile";
import Repository from "./components/repo/Repository";
import IssueList from "./components/issue/IssueList";
import CreateIssue from "./components/issue/CreateIssue";
import Issue from "./components/issue/issues";

const Routes = () => {
  
  let element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/register", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    { path: "/repo/:repoId", element: <Repository /> },
    { path: "/repo/:repoId/issues", element: <IssueList /> },
    { path: "/repo/:repoId/issues/new", element: <CreateIssue /> },
    { path: "/repo/:repoId/issues/:issueId", element: <Issue /> }, 
  ]);

  return element;
};

export default Routes;