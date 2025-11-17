import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BlockchainContext } from "../context/BlockchainContext";
//import './Navbar.css'; // Tạo file này để CSS

const Navbar = () => {
  const { account, connectWallet, isLoading } = useContext(BlockchainContext);

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Voting dApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Trang Chủ</Link>
        <Link to="/vote">Bỏ Phiếu</Link>
        <Link to="/results">Kết Quả</Link>
      </div>
      <div className="navbar-wallet">
        <button
          onClick={!account ? connectWallet : undefined}
          className="wallet-button"
          disabled={isLoading}
        >
          {isLoading
            ? "Đang kết nối..."
            : account
            ? truncateAddress(account)
            : "Kết Nối Ví"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
