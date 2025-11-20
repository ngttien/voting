import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VotingFactoryContext } from "../context/VotingFactoryContext";
import "../App.css";

const CreateVotingPage = () => {
  const { currentAccount, createVoting, isLoading } = useContext(VotingFactoryContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Vui lòng nhập tên cuộc bầu chọn!");
      return;
    }

    const success = await createVoting(title, description);
    if (success) {
      alert("Tạo cuộc bầu chọn thành công! Bạn là admin của cuộc bầu chọn này.");
      navigate('/select-voting'); // Chuyển đến trang chọn voting
    }
  };

  if (!currentAccount) {
    return (
      <div className="main-content">
        <h2>Chưa kết nối ví</h2>
        <p>Vui lòng kết nối ví MetaMask để tạo cuộc bầu chọn.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Tạo Cuộc Bầu Chọn Mới</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bạn sẽ trở thành quản trị viên của cuộc bầu chọn này
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Tên cuộc bầu chọn: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="VD: Bầu cử Ban Chấp Hành Lớp 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Mô tả (tùy chọn):
          </label>
          <textarea
            placeholder="VD: Cuộc bầu cử để chọn ra Ban Chấp Hành lớp nhiệm kỳ 2024-2025"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={isLoading}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo Cuộc Bầu Chọn'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            Đang xử lý giao dịch trên blockchain... Vui lòng xác nhận trên MetaMask và chờ đợi.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateVotingPage;
