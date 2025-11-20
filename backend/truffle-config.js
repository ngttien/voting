require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // port Ganache GUI
      network_id: "*", // Match any network id
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: "https://ethereum-sepolia-rpc.publicnode.com",
          pollingInterval: 10000,
          timeout: 60000,
        }),
      network_id: 11155111, // Sepolia Chain ID
      gas: 5500000,
      gasPrice: 10000000000, // 10 gwei (giảm xuống để tiết kiệm)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 120000,
    },
  },

  compilers: {
    solc: {
      version: "0.8.20", // giống version dùng trong Remix
    },
  },
};
