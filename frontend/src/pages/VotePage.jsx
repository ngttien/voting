import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";
import CandidateCard from "../components/CandidateCard";
import "../App.css";

const VotePage = () => {
  const { candidates, vote, isLoading, isAdmin, votingOpen, currentVotingAddress } = useContext(VotingFactoryContext);
  const navigate = useNavigate();

  if (!currentVotingAddress) {
    return (
      <div className="main-content">
        <h2>Chưa chọn cuộc bầu chọn</h2>
        <p>Vui lòng chọn một cuộc bầu chọn để tham gia bỏ phiếu.</p>
        <button onClick={() => navigate('/select-voting')}>
          Chọn cuộc bầu chọn
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="main-content">
        <h2>Đang xử lý phiếu bầu...</h2>
        <p>Vui lòng chờ xác nhận giao dịch trên MetaMask.</p>
      </div>
    );
  }

  // CHẶN ADMIN KHÔNG ĐƯỢC BỎ PHIẾU
  if (isAdmin) {
    return (
      <div className="main-content">
        <h2>Truy cập bị từ chối</h2>
        <p>Admin không được phép bỏ phiếu.</p>
        <p>Bạn chỉ có thể quản lý ứng viên và cử tri trong trang Admin.</p>
      </div>
    );
  }

  if (!votingOpen) {
    return (
      <div className="main-content">
        <h2>Bầu cử đã đóng</h2>
        <p>Cuộc bầu cử hiện đã kết thúc. Bạn không thể bỏ phiếu nữa.</p>
        <p>Vui lòng xem kết quả tại trang "Kết quả".</p>
      </div>
    );
  }

  return (
    <div className="main-content vote-page">
      <h2>Danh sách ứng viên</h2>
      <p>Chọn ứng viên để bỏ phiếu</p>
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
          <p>Chưa có ứng viên nào. Vui lòng liên hệ Admin để thêm ứng viên.</p>
        )}
      </div>
    </div>
  );
};

// Dòng này rất quan trọng
export default VotePage;
