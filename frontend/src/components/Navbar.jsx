import React, { useContext } from "react"; // <-- 1. THÊM useContext
import { Link } from "react-router-dom";
// Import Context để kiểm tra quyền Admin
import { BlockchainContext } from "../context/BlockchainContext"; // <-- 2. IMPORT CONTEXT

const Navbar = () => {
  // Lấy các giá trị từ Context
  const { connectWallet, currentAccount, isAdmin } =
    useContext(BlockchainContext); // <-- 3. LẤY isAdmin

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Voting DApp</Link>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/vote">Bỏ phiếu</Link>
        </li>
        <li>
          <Link to="/results">Kết quả</Link>
        </li>

        {/* 4. CHỈ HIỂN THỊ NẾU LÀ ADMIN */}
        {isAdmin && (
          <li className="admin-link">
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul>
      <div className="navbar-wallet">
        {currentAccount ? (
          <span className="wallet-address">
            {/* Cắt ngắn địa chỉ ví cho đẹp */}
            {`${currentAccount.substring(0, 6)}...${currentAccount.substring(
              currentAccount.length - 4
            )}`}
          </span>
        ) : (
          <button className="connect-wallet-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
