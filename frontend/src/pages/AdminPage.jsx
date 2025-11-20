import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";
import "../App.css";

const AdminPage = () => {
  const { isAdmin, addCandidate, isLoading, votingOpen, closeVoting, openVoting, currentVotingAddress } =
    useContext(VotingFactoryContext);
  const navigate = useNavigate();

  // Tạo state cục bộ để lưu trữ giá trị từ các ô input
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState(""); // Địa chỉ ví ứng viên

  // Xử lý khi submit form "Thêm ứng viên"
  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (candidateName && candidateAddress) {
      addCandidate(candidateName, candidateAddress);
      setCandidateName("");
      setCandidateAddress("");
    } else {
      alert("Vui lòng nhập đầy đủ thông tin ứng viên!");
    }
  };

  // === PHẦN HIỂN THỊ (RENDER) ===

  if (!currentVotingAddress) {
    return (
      <div className="main-content">
        <h2>Chưa chọn cuộc bầu chọn</h2>
        <p>Vui lòng chọn một cuộc bầu chọn để quản lý.</p>
        <button onClick={() => navigate('/select-voting')}>
          Chọn cuộc bầu chọn
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="main-content">
        <h2>Đang xử lý...</h2>
        <p>Vui lòng xác nhận giao dịch trên MetaMask và chờ đợi.</p>
      </div>
    );
  }

  // CHẶN USER KHÔNG ĐƯỢC VÀO TRANG ADMIN
  if (!isAdmin) {
    return (
      <div className="main-content">
        <h2>Truy cập bị từ chối</h2>
        <p>Bạn phải là Admin để xem trang này.</p>
        <p>Chỉ Admin mới có quyền quản lý ứng viên và cử tri.</p>
      </div>
    );
  }

  // Nếu LÀ ADMIN, hiển thị các form
  return (
    <div className="main-content">
      <h2>Trang Quản Trị (Admin Panel)</h2>
      <p>Chào Admin, bạn có thể quản lý cuộc bỏ phiếu tại đây.</p>

      <div style={{ 
        padding: '15px', 
        marginBottom: '20px', 
        backgroundColor: votingOpen ? '#d4edda' : '#f8d7da',
        border: `1px solid ${votingOpen ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '5px'
      }}>
        <h3>Trạng thái bầu cử: {votingOpen ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}</h3>
        <p>{votingOpen ? 'Sinh viên có thể bỏ phiếu' : 'Sinh viên không thể bỏ phiếu'}</p>
        <button 
          onClick={votingOpen ? closeVoting : openVoting}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: votingOpen ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Đang xử lý...' : (votingOpen ? 'Đóng Bầu Cử' : 'Mở Bầu Cử')}
        </button>
      </div>

      <hr />

      {/* Form 1: Thêm ứng viên */}
      <div className="admin-form">
        <h3>Thêm Ứng Viên Mới</h3>
        <form onSubmit={handleAddCandidate}>
          <label>Tên ứng viên:</label>
          <input
            type="text"
            placeholder="Nhập tên ứng viên (VD: Nguyễn Văn A)"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />
          
          <label>Địa chỉ ví ứng viên (MetaMask Address):</label>
          <input
            type="text"
            placeholder="0x..."
            value={candidateAddress}
            onChange={(e) => setCandidateAddress(e.target.value)}
            pattern="^0x[a-fA-F0-9]{40}$"
            title="Địa chỉ ví phải bắt đầu bằng 0x và có 42 ký tự"
            required
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Thêm Ứng Viên"}
          </button>
        </form>
      </div>

      {/* Chức năng đăng ký cử tri đã bị xóa - Ai cũng có thể bỏ phiếu */}
    </div>
  );
};

export default AdminPage;
