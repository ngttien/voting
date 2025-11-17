import React, { useState, useEffect, createContext } from "react";
import Web3 from "web3";
import Voting from "../contracts/Voting.json"; // ABI từ contract build

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Vui lòng cài MetaMask!");
      return;
    }

    setIsLoading(true);
    try {
      // Tạo instance Web3 từ MetaMask
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      // Lấy contract address từ .env
      const address = process.env.REACT_APP_CONTRACT_ADDRESS;

      // Tạo contract instance
      const votingContract = new web3Instance.eth.Contract(Voting.abi, address);
      setContract(votingContract);

      console.log("✅ Kết nối blockchain thành công:", accounts[0]);
    } catch (error) {
      console.error("❌ Lỗi kết nối blockchain:", error);
    }
    setIsLoading(false);
  };

  // Lắng nghe thay đổi account & network
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
          setWeb3(null);
        }
      };

      const handleChainChanged = (_chainId) => {
        window.location.reload(); // reload page khi đổi network
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        account,
        contract,
        web3,
        isLoading,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
