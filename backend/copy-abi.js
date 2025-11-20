/* File này là một script Node.js.
  Nó sẽ chạy TRÊN MÁY của bạn (backend), KHÔNG chạy trên trình duyệt (frontend).
  Vì vậy, nó CÓ THỂ dùng 'fs' (File System).
*/

const fs = require("fs");
const path = require("path");

try {
  console.log("Bat dau copy ABI...");

  // Copy Voting.json
  const votingSourcePath = path.resolve(__dirname, "build/contracts/Voting.json");
  const votingDestPath = path.resolve(__dirname, "../frontend/src/contracts/Voting.json");
  const votingData = fs.readFileSync(votingSourcePath, "utf8");
  fs.writeFileSync(votingDestPath, votingData);
  console.log(" ✓ Đã copy Voting.json");

  // Copy VotingFactory.json
  const factorySourcePath = path.resolve(__dirname, "build/contracts/VotingFactory.json");
  const factoryDestPath = path.resolve(__dirname, "../frontend/src/contracts/VotingFactory.json");
  const factoryData = fs.readFileSync(factorySourcePath, "utf8");
  fs.writeFileSync(factoryDestPath, factoryData);
  console.log(" ✓ Đã copy VotingFactory.json");

  console.log(" ----------------------------------");
  console.log(" Đã copy tất cả ABI sang frontend thanh cong!");
  console.log(" ----------------------------------");
} catch (error) {
  console.error(" LOI khi copy ABI:");
  console.error(error);
}
