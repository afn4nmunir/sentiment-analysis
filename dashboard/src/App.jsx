import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SentimentDashboard from "./components/SentimentDashboard";
import ResponsiveLayout from "./components/ResponsiveLayout";

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ResponsiveLayout>
              <SentimentDashboard />
            </ResponsiveLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}