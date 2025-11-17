import React, { useContext, useState } from "react";
// Import context của chúng ta
import { BlockchainContext } from "../context/BlockchainContext";
// Import CSS (tùy chọn, bạn có thể thêm style sau)
import "../App.css";

const AdminPage = () => {
  // Lấy các giá trị và hàm từ Context
  // === SỬA LỖI 1: Thêm 'removeVoter' ===
  const { isAdmin, addCandidate, registerVoter, isLoading, removeVoter } =
    useContext(BlockchainContext);

  // Tạo state cục bộ để lưu trữ giá trị từ các ô input
  const [candidateName, setCandidateName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voterName, setVoterName] = useState("");
  const [addressToRemove, setAddressToRemove] = useState(""); // State cho form xóa

  // Xử lý khi submit form "Thêm ứng viên"
  const handleAddCandidate = (e) => {
    e.preventDefault(); // Ngăn trang tải lại
    if (candidateName) {
      addCandidate(candidateName);
      setCandidateName(""); // Xóa ô input sau khi gửi
    }
  };

  // Xử lý khi submit form "Đăng ký cử tri"
  const handleRegisterVoter = (e) => {
    e.preventDefault(); // Ngăn trang tải lại
    if (voterAddress && voterName) {
      registerVoter(voterAddress, voterName);
      setVoterAddress(""); // Xóa ô input
      setVoterName(""); // Xóa ô input
    }
  };

  // Xử lý khi submit form "Xóa cử tri"
  const handleRemoveVoter = (e) => {
    e.preventDefault();
    if (addressToRemove) {
      if (
        window.confirm(`Ban co chac chan muon xoa cu tri ${addressToRemove}?`)
      ) {
        removeVoter(addressToRemove);
        setAddressToRemove("");
      }
    }
  };

  // === PHẦN HIỂN THỊ (RENDER) ===

  // === SỬA LỖI 2: Sửa logic 'isLoading' ===
  // Hiển thị loading riêng, không gộp chung với "Access Denied"
  if (isLoading) {
    return (
      <div className="main-content">
        <h2>Đang xử lý...</h2>
        <p>Vui lòng xác nhận giao dịch trên MetaMask và chờ đợi.</p>
      </div>
    );
  }

  // Nếu không phải Admin, hiển thị thông báo chặn
  if (!isAdmin) {
    return (
      <div className="main-content">
        <h2>Truy cập bị từ chối</h2>
        <p>Bạn phải là Admin để xem trang này.</p>
      </div>
    );
  }

  // Nếu LÀ ADMIN, hiển thị các form
  return (
    <div className="main-content">
      <h2>Trang Quản Trị (Admin Panel)</h2>
      <p>Chào Admin, bạn có thể quản lý cuộc bỏ phiếu tại đây.</p>

      <hr />

      {/* Form 1: Thêm ứng viên */}
      <div className="admin-form">
        <h3>Thêm Ứng Viên Mới</h3>
        <form onSubmit={handleAddCandidate}>
          <label>Tên ứng viên:</label>
          <input
            type="text"
            placeholder="Nhập tên ứng viên"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Thêm Ứng Viên"}
          </button>
        </form>
      </div>

      <hr />

      {/* Form 2: Đăng ký cử tri (Whitelist) */}
      <div className="admin-form">
        <h3>Đăng Ký Cử Tri (Whitelist)</h3>
        <form onSubmit={handleRegisterVoter}>
          <label>Địa chỉ ví (Address):</label>
          <input
            type="text"
            placeholder="Địa chỉ ví (0x...)"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
            required
          />
          <label>Tên cử tri:</label>
          <input
            type="text"
            placeholder="Nhập tên cử tri"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Ký Cử Tri"}
          </button>
        </form>
      </div>

      {/* Form 3: Xóa Cử Tri (Whitelist) */}
      <hr />
      <div className="admin-form" style={{ backgroundColor: "#ffdddd" }}>
        <h3>Xóa Cử Tri (Nguy hiểm)</h3>
        <form onSubmit={handleRemoveVoter}>
          <label>Địa chỉ ví (Address):</label>
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ ví (0x...)"
            value={addressToRemove}
            onChange={(e) => setAddressToRemove(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: "#dc3545" }}
          >
            {isLoading ? "Đang xử lý..." : "Xóa Cử Tri"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
