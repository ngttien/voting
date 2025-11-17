// backend/services/candidate.service.js
const { web3, votingContract } = require("../configs/blockchain.config");

class CandidateService {
  async getAllCandidates() {
    return await votingContract.methods.getCandidates().call();
  }

  async addCandidate(candidate) {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods
      .addCandidate(candidate.id, candidate.name)
      .send({ from: accounts[0] });
    return candidate;
  }
}

module.exports = new CandidateService();
