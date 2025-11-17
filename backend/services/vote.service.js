// backend/services/vote.service.js
const { web3, votingContract } = require("../configs/blockchain.config");

class VoteService {
  async getAllVotes() {
    return await votingContract.methods.getAllVotes().call();
  }

  async createVote({ voterId, candidateId }) {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
    return { voterId, candidateId };
  }
}

module.exports = new VoteService();
