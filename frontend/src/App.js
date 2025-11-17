import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
// Đảm bảo chúng ta import AdminPage (file mới)
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Đây là các component được import mặc định (default) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />{" "}
          {/* Route mới cho Admin */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
