import React, { useState, useEffect, useContext } from "react";
import { BlockchainContext } from "../context/BlockchainContext";

const ResultsPage = () => {
  const { contract } = useContext(BlockchainContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (contract) {
        setLoading(true);
        try {
          // 1. CÚ PHÁP WEB3.JS ĐỂ ĐỌC DỮ LIỆU
          // Dùng .methods.tên_hàm().call()
          // Dựa trên ABI, bạn có hàm getAllCandidates()
          const fetchedCandidates = await contract.methods
            .getAllCandidates()
            .call();

          // 2. Xử lý dữ liệu trả về
          // Web3.js (v4.x) trả về BigInt (giống Ethers v6)
          const formattedResults = fetchedCandidates.map((candidate) => ({
            id: candidate.id.toString(), // Chuyển BigInt sang String
            name: candidate.name,
            voteCount: candidate.voteCount.toString(), // Chuyển BigInt sang String
          }));

          // Sắp xếp
          formattedResults.sort(
            (a, b) => Number(b.voteCount) - Number(a.voteCount)
          );

          setResults(formattedResults);
        } catch (error) {
          console.error("Không thể lấy kết quả từ contract:", error);
        }
        setLoading(false);
      }
    };

    fetchResults();
  }, [contract]); // Chạy lại khi contract sẵn sàng

  if (loading) return <p>Đang tải kết quả...</p>;
  if (!contract) return <p>Vui lòng kết nối ví để xem kết quả.</p>;

  // 3. Phần return JSX y hệt như trước
  return (
    <div className="page-container">
      <h2>Kết Quả Bỏ Phiếu (On-Chain)</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Ứng Cử Viên</th>
            <th>Số Phiếu Bầu</th>
          </tr>
        </thead>
        <tbody>
          {results.map((candidate) => (
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
