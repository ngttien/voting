/* File này là một script Node.js.
  Nó sẽ chạy TRÊN MÁY của bạn (backend), KHÔNG chạy trên trình duyệt (frontend).
  Vì vậy, nó CÓ THỂ dùng 'fs' (File System).
*/

const fs = require("fs");
const path = require("path");

try {
  console.log("Bat dau copy ABI...");

  // 1. Đường dẫn ĐỌC: File Voting.json trong thư mục build
  const sourcePath = path.resolve(__dirname, "build/contracts/Voting.json");

  // 2. Đường dẫn GHI: File Voting.json trong thư mục frontend
  const destPath = path.resolve(
    __dirname,
    "../frontend/src/contracts/Voting.json"
  );

  // 3. Đọc file nguồn
  const sourceData = fs.readFileSync(sourcePath, "utf8");

  // 4. Ghi đè file đích
  fs.writeFileSync(destPath, sourceData);

  console.log(" ----------------------------------");
  console.log(" Đã copy ABI (Voting.json) sang frontend thanh cong!");
  console.log(" ----------------------------------");
} catch (error) {
  console.error(" LOI khi copy ABI:");
  console.error(error);
}
