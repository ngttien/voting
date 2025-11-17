import React, { useContext } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import CandidateCard from "../components/CandidateCard";
import "../App.css";

const VotePage = () => {
  const { candidates, vote, isLoading } = useContext(BlockchainContext);

  if (isLoading) {
    return (
      <div className="main-content">
        <h2>Đang xử lý phiếu bầu...</h2>
        <p>Vui lòng chờ xác nhận giao dịch trên MetaMask.</p>
      </div>
    );
  }

  return (
    <div className="main-content vote-page">
      <h2>Danh sách ứng viên</h2>
      <div className="candidate-list">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={vote}
            />
          ))
        ) : (
          <p>Chưa có ứng viên nào được thêm vào.</p>
        )}
      </div>
    </div>
  );
};

// Dòng này rất quan trọng
export default VotePage;
