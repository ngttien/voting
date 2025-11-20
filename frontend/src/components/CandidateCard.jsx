import React from "react";

const CandidateCard = ({ candidate, onVote }) => {
  const handleVote = () => {
    if (window.confirm(`Bạn có chắc muốn bỏ phiếu cho ${candidate.name}?`)) {
      onVote(candidate.id);
    }
  };

  return (
    <div className="candidate-card">
      <h3>{candidate.name}</h3>
      <p><strong>ID:</strong> {candidate.id}</p>
      <p><strong>Địa chỉ ví:</strong></p>
      <p className="candidate-address">{candidate.candidateAddress}</p>
      <p><strong>Số phiếu:</strong> {candidate.voteCount}</p>
      <button onClick={handleVote} className="vote-button">
        Bỏ phiếu
      </button>
    </div>
  );
};

export default CandidateCard;
