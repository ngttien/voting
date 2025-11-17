import React from "react";
//import './CandidateCard.css'; // Tạo file này để CSS

const CandidateCard = ({ candidate, onSelect, isSelected }) => {
  // candidate.name, candidate.description lấy từ API (backend MVC)
  // candidate.voteCount lấy từ Smart Contract (đã được join ở VotePage)

  return (
    <div
      className={`candidate-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(candidate.id)}
    >
      {/* <img src={candidate.imageUrl || 'default-image.png'} alt={candidate.name} /> */}
      <h3>{candidate.name}</h3>
      <p>{candidate.description || "Chưa có mô tả"}</p>
      {/* Hiển thị vote count (nếu có) */}
      {candidate.voteCount !== undefined && (
        <p>
          <strong>Số phiếu: {candidate.voteCount}</strong>
        </p>
      )}
    </div>
  );
};

export default CandidateCard;
