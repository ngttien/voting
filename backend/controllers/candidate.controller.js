// controllers/candidate.controller.js
const CandidateService = require("../services/candidate.service");

class CandidateController {
  getAllCandidates = async (req, res) => {
    try {
      const candidates = await CandidateService.getCandidates(); // call() từ blockchain
      res.status(200).json(candidates);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách ứng viên", error });
    }
  };

  addCandidate = async (req, res) => {
    try {
      const { name, adminAddress } = req.body;
      const txResult = await CandidateService.addCandidate(name, adminAddress); // gửi transaction
      res.status(201).json({ message: "Thêm ứng viên thành công", txResult });
    } catch (error) {
      res.status(500).json({ message: "Thêm ứng viên thất bại", error });
    }
  };
}

module.exports = new CandidateController();
