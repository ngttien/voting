import React, { useContext } from "react"; // Bỏ useState nếu không dùng
import { BlockchainContext } from "../context/BlockchainContext";
// Đảm bảo đây là import default (không có dấu ngoặc {})
import CandidateCard from "../components/CandidateCard";

const VotePage = () => {
  // Lấy isLoading từ context
  const { candidates, vote, isLoading } = useContext(BlockchainContext);

  // Nếu đang xử lý (sau khi bấm vote), hiển thị loading
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
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onVote={vote} // Hàm vote từ context
          />
        ))}
      </div>
    </div>
  );
};

// Đảm bảo file này cũng export default
export default VotePage;
