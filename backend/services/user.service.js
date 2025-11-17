// backend/services/user.service.js
const { web3, votingContract } = require("../configs/blockchain.config");

class UserService {
  async getAllUsers() {
    return await votingContract.methods.getAllUsers().call();
  }

  async getUserById(id) {
    return await votingContract.methods.getUser(id).call();
  }

  async createUser(userData) {
    const accounts = await web3.eth.getAccounts();
    // Dùng account[0] gửi transaction
    await votingContract.methods
      .addUser(userData.id, userData.name)
      .send({ from: accounts[0] });
    return userData;
  }

  async updateUser(id, updateData) {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods
      .updateUser(id, updateData.name)
      .send({ from: accounts[0] });
    return { id, ...updateData };
  }

  async deleteUser(id) {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.deleteUser(id).send({ from: accounts[0] });
    return true;
  }
}

module.exports = new UserService();
