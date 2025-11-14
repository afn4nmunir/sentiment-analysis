import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <div className="layout">
            <Sidebar />
            <Dashboard />
          </div>
        }
      />

      <Route
        path="/settings"
        element={
          <div className="layout">
            <Sidebar />
            <Settings />
          </div>
        }
      />
      </Routes>
    </BrowserRouter>
  );
}