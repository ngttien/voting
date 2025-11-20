import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";
import "../App.css";

const WelcomePage = () => {
  const { currentAccount } = useContext(VotingFactoryContext);
  const navigate = useNavigate();

  return (
    <div className="main-content" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
        Chào mừng đến với Hệ thống Bầu chọn
      </h1>
      
      {currentAccount ? (
        <div>
          <p style={{ fontSize: '1.2em', marginBottom: '40px', color: '#666' }}>
            Bạn muốn làm gì hôm nay?
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '30px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{
              flex: '1',
              minWidth: '300px',
              padding: '40px',
              border: '2px solid #007bff',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: '#f8f9fa'
            }}
            onClick={() => navigate('/create-voting')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,123,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Tạo Bầu Chọn</h2>
              <p style={{ color: '#666' }}>
                Tạo cuộc bầu chọn mới và trở thành quản trị viên
              </p>
            </div>

            <div style={{
              flex: '1',
              minWidth: '300px',
              padding: '40px',
              border: '2px solid #28a745',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: '#f8f9fa'
            }}
            onClick={() => navigate('/select-voting')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(40,167,69,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Tham Gia Bầu Chọn</h2>
              <p style={{ color: '#666' }}>
                Chọn một cuộc bầu chọn có sẵn để tham gia bỏ phiếu
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#004085' }}>
              <strong>Ví đã kết nối:</strong> {currentAccount}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ padding: '40px', backgroundColor: '#fff3cd', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.2em', color: '#856404', margin: 0 }}>
            Vui lòng kết nối ví MetaMask ở góc trên bên phải để bắt đầu
          </p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
