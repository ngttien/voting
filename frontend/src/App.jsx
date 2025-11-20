import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WelcomePage from "./pages/WelcomePage";
import CreateVotingPage from "./pages/CreateVotingPage";
import SelectVotingPage from "./pages/SelectVotingPage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/create-voting" element={<CreateVotingPage />} />
          <Route path="/select-voting" element={<SelectVotingPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

