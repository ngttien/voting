// backend/configs/blockchain.config.js
const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

// Load ABI
const contractPath = path.join(__dirname, "../build/contracts/Voting.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));

// Contract address đã deploy
const contractAddress = "0x8e3b688384015B7db160bB7EAd0bBCf61b99cE80";

// Tạo web3 instance kết nối Ganache
const web3 = new Web3("http://127.0.0.1:8545");

// Tạo contract instance
const votingContract = new web3.eth.Contract(contractJson.abi, contractAddress);

module.exports = {
  web3,
  votingContract,
};
