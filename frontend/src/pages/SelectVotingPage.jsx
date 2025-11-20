import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";
import "../App.css";

const SelectVotingPage = () => {
  const { currentAccount, getAllVotings, selectVoting, isLoading } = useContext(VotingFactoryContext);
  const navigate = useNavigate();
  const [votings, setVotings] = useState([]);
  const [loadingVotings, setLoadingVotings] = useState(true);

  useEffect(() => {
    loadVotings();
  }, [currentAccount]);

  const loadVotings = async () => {
    setLoadingVotings(true);
    const list = await getAllVotings();
    setVotings(list || []);
    setLoadingVotings(false);
  };

  const handleSelectVoting = async (votingAddress) => {
    const success = await selectVoting(votingAddress);
    if (success) {
      navigate('/vote'); // Chuyển đến trang vote
    }
  };

  if (!currentAccount) {
    return (
      <div className="main-content">
        <h2>Chưa kết nối ví</h2>
        <p>Vui lòng kết nối ví MetaMask để xem danh sách cuộc bầu chọn.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Chọn Cuộc Bầu Chọn</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Chọn một cuộc bầu chọn để tham gia bỏ phiếu
      </p>

      {loadingVotings ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải danh sách cuộc bầu chọn...</p>
        </div>
      ) : votings.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
            Chưa có cuộc bầu chọn nào
          </p>
          <button 
            onClick={() => navigate('/create-voting')}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tạo cuộc bầu chọn đầu tiên
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {votings.map((voting, index) => (
            <div 
              key={index}
              style={{
                border: '2px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: 'white',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#007bff';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,123,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleSelectVoting(voting.address)}
            >
              <h3 style={{ marginBottom: '10px', color: '#007bff' }}>
                {voting.title}
              </h3>
              
              {voting.description && (
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.9em' }}>
                  {voting.description}
                </p>
              )}
              
              <div style={{ 
                fontSize: '0.85em', 
                color: '#999',
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Số ứng viên:</strong> {voting.candidateCount}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Trạng thái:</strong>{' '}
                  <span style={{ 
                    color: voting.isOpen ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {voting.isOpen ? 'Đang mở' : 'Đã đóng'}
                  </span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Admin:</strong>{' '}
                  <span style={{ 
                    color: voting.isAdmin ? '#007bff' : '#666',
                    fontWeight: voting.isAdmin ? 'bold' : 'normal'
                  }}>
                    {voting.isAdmin ? 'Bạn' : voting.admin.slice(0, 6) + '...' + voting.admin.slice(-4)}
                  </span>
                </p>
                <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#aaa' }}>
                  {voting.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 25px',
            fontSize: '14px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default SelectVotingPage;
