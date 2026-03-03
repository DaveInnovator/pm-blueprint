import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Project from "./pages/Project";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<NewProject />} />
        <Route path="/project/:id" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}
