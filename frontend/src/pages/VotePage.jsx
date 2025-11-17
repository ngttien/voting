const fetchContractCandidates = async () => {
  if (!contract) return; // chưa load contract
  setLoading(true);
  setError(null);

  try {
    // Lấy danh sách ứng viên từ blockchain
    const candidates = await contract.methods.getAllCandidates().call();

    // Format dữ liệu cho frontend
    const formattedCandidates = candidates.map((c) => ({
      id: Number(c.id),
      name: c.name,
      voteCount: Number(c.voteCount),
    }));

    setCandidates(formattedCandidates);
  } catch (err) {
    console.error(" Lỗi lấy ứng viên từ contract:", err);
    setError("Không thể tải ứng viên từ blockchain.");
  }

  setLoading(false);
};
