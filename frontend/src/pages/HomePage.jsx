import React, { useContext } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import "../App.css"; // Giữ lại CSS

const HomePage = () => {
  // SỬA LỖI: Tên biến là 'currentAccount'
  const { currentAccount } = useContext(BlockchainContext);

  return (
    <div className="main-content">
      {" "}
      {/* Đổi tên class nếu cần */}
      <h1>Chào mừng đến với App Bỏ Phiếu</h1>
      {currentAccount ? (
        <div>
          <p>Bạn đã kết nối với ví:</p>
          <strong>{currentAccount}</strong>
        </div>
      ) : (
        <p>Vui lòng kết nối ví (MetaMask) ở góc trên bên phải để bắt đầu.</p>
      )}
    </div>
  );
};

export default HomePage;
