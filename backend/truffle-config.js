module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // port Ganache GUI
      network_id: "*", // Match any network id
    },
  },

  compilers: {
    solc: {
      version: "0.8.20", // giống version dùng trong Remix
    },
  },
};
