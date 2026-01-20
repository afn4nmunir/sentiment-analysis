// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <div className="dashboard-shell">
              <Dashboard />
            </div>
          }
        />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
