const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

// Load file ABI + networks từ Truffle build
const contractPath = path.join(__dirname, "../build/contracts/Voting.json");
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));

// ⚡ Tự động lấy contract address mới nhất từ Truffle Networks
let contractAddress = null;

const networks = contractJson.networks;
if (networks && Object.keys(networks).length > 0) {
  const networkId = Object.keys(networks)[0]; // lấy network id mới nhất
  contractAddress = networks[networkId].address;
}

if (!contractAddress) {
  console.error(" Không tìm thấy contract address trong Voting.json!");
} else {
  console.log("Contract Address Loaded:", contractAddress);
}

// Tạo web3 instance (Ganache)
const web3 = new Web3("http://127.0.0.1:8545");

// Tạo instance contract
let votingContract = null;
if (contractAddress) {
  votingContract = new web3.eth.Contract(contractJson.abi, contractAddress);
}

module.exports = {
  web3,
  votingContract,
  contractAddress,
};

// const Web3 = require("web3");
// const path = require("path");
// const fs = require("fs");

// // Đường dẫn ABI
// const contractPath = path.join(__dirname, "../build/contracts/Voting.json");
// const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));

// // Contract address sau khi deploy
// const contractAddress = "0xa03B821cCC244efd016B1c2DbA0631c8d8f1bDb8";

// // Tạo web3 instance
// const web3 = new Web3("http://127.0.0.1:8545"); // Ganache

// // Tạo instance contract
// const votingContract = new web3.eth.Contract(contractJson.abi, contractAddress);

// module.exports = {
//   web3,
//   votingContract,
// };
