import React, { useContext } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import "../App.css"; // Giữ lại CSS

const ResultsPage = () => {
  // Lấy 'candidates' và 'isLoading' từ Context (do Ethers cung cấp)
  const { candidates, isLoading } = useContext(BlockchainContext);

  if (isLoading) return <p>Đang tải kết quả...</p>;
  if (!candidates || candidates.length === 0) {
    return <p>Chưa có ứng viên nào để hiển thị. Vui lòng kết nối ví.</p>;
  }

  // Sắp xếp kết quả (tùy chọn)
  const sortedResults = [...candidates].sort(
    (a, b) => b.voteCount - a.voteCount
  );

  return (
    <div className="main-content">
      {" "}
      {/* Đổi tên class nếu cần */}
      <h2>Kết Quả Bỏ Phiếu</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Ứng Cử Viên</th>
            <th>Số Phiếu Bầu</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
