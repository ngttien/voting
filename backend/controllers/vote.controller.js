// controllers/vote.controller.js
const VoteService = require("../services/vote.service");

class VoteController {
  getAllVotes = async (req, res) => {
    try {
      const votes = await VoteService.getAllVotes(); // call() từ blockchain
      res.status(200).json(votes);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách vote", error });
    }
  };

  vote = async (req, res) => {
    try {
      const { voterAddress, candidateId } = req.body;
      const txResult = await VoteService.vote(voterAddress, candidateId); // gửi transaction
      res.status(201).json({ message: "Vote thành công", txResult });
    } catch (error) {
      res.status(500).json({ message: "Vote thất bại", error });
    }
  };
}

module.exports = new VoteController();
