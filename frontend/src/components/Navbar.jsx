import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";

const Navbar = () => {
  const { connectWallet, currentAccount, isAdmin, votingInfo } =
    useContext(VotingFactoryContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Voting DApp</Link>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        {votingInfo && (
          <>
            <li>
              <Link to="/vote">Bỏ phiếu</Link>
            </li>
            <li>
              <Link to="/results">Kết quả</Link>
            </li>
            {isAdmin && (
              <li className="admin-link">
                <Link to="/admin">Admin Panel</Link>
              </li>
            )}
          </>
        )}
      </ul>
      {votingInfo && (
        <div style={{ 
          color: 'white', 
          fontSize: '0.9em', 
          marginRight: '20px',
          padding: '5px 10px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '5px'
        }}>
          {votingInfo.title}
        </div>
      )}
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
