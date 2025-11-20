  import React, { createContext, useState, useEffect, useRef } from "react";
import { BrowserProvider, Contract, isAddress } from "ethers";
import VotingContract from "../contracts/Voting.json";

export const BlockchainContext = createContext();

const SEPOLIA_NETWORK_ID = "11155111";
const contractAddress = VotingContract.networks[SEPOLIA_NETWORK_ID]?.address;
const contractABI = VotingContract.abi;

console.log("Contract Address:", contractAddress);

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminAddress, setAdminAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true); // Trạng thái bầu cử

  // Hàm tạo contract instance
  const getContract = async () => {
    if (!window.ethereum) return null;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

      // Tự động chuyển sang Sepolia nếu sai network
      if (currentChainId !== 11155111) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
          window.location.reload();
          return null;
        } catch (error) {
          console.error("Failed to switch network:", error);
          return null;
        }
      }

      const signer = await provider.getSigner();
      const votingContract = new Contract(contractAddress, contractABI, signer);
      return votingContract;
    } catch (error) {
      console.error("Error creating contract:", error);
      return null;
    }
  };

  // Load dữ liệu blockchain - CHỈ GỌI KHI CẦN
  const loadBlockchainData = async () => {
    try {
      const contractInstance = await getContract();
      if (!contractInstance) return;

      setContract(contractInstance);

      // Load admin
      const admin = await contractInstance.admin();
      setAdminAddress(admin.toLowerCase());

      // Load voting status
      const isOpen = await contractInstance.votingOpen();
      setVotingOpen(isOpen);

      // Load candidates
      const count = await contractInstance.candidatesCount();
      if (Number(count) > 0) {
        const allCandidates = await contractInstance.getAllCandidates();
        const formatted = allCandidates.map(c => ({
          id: Number(c.id),
          name: c.name,
          candidateAddress: c.candidateAddress, // Thêm địa chỉ ứng viên
          voteCount: Number(c.voteCount)
        }));
        setCandidates(formatted);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  // Check admin khi account hoặc adminAddress thay đổi
  useEffect(() => {
    if (currentAccount && adminAddress) {
      setIsAdmin(currentAccount.toLowerCase() === adminAddress.toLowerCase());
    }
  }, [currentAccount, adminAddress]);

  // Kết nối ví
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Vui long cai dat MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0].toLowerCase();
      setCurrentAccount(account);
      
      await loadBlockchainData();
      
      // Kiểm tra admin sau khi load xong
      if (adminAddress && account === adminAddress.toLowerCase()) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      // Check admin
      if (adminAddress && account === adminAddress.toLowerCase()) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Disconnect
  const disconnectWallet = () => {
    setCurrentAccount(null);
    setContract(null);
    setCandidates([]);
    setIsAdmin(false);
  };

  // Vote
  const vote = async (candidateId) => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      const tx = await contract.vote(candidateId);
      await tx.wait();
      await loadBlockchainData(); // Reload sau khi vote
      alert("Bo phieu thanh cong!");
    } catch (error) {
      console.error("Error voting:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add candidate
  const addCandidate = async (name, address) => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      
      // Validate address
      if (!isAddress(address)) {
        alert("Dia chi vi ung vien khong hop le!");
        setIsLoading(false);
        return;
      }
      
      const tx = await contract.addCandidate(name, address);
      await tx.wait();
      await loadBlockchainData(); // Reload sau khi thêm
      alert("Them ung vien thanh cong!");
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Register voter
  const registerVoter = async (address, name) => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      if (!isAddress(address)) {
        alert("Dia chi vi khong hop le!");
        return;
      }
      const tx = await contract.registerVoter(address, name);
      await tx.wait();
      alert("Dang ky cu tri thanh cong!");
    } catch (error) {
      console.error("Error registering voter:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Close voting (Admin only)
  const closeVoting = async () => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      const tx = await contract.closeVoting();
      await tx.wait();
      await loadBlockchainData();
      alert("Da dong bau cu thanh cong!");
    } catch (error) {
      console.error("Error closing voting:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Open voting (Admin only)
  const openVoting = async () => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      const tx = await contract.openVoting();
      await tx.wait();
      await loadBlockchainData();
      alert("Da mo bau cu thanh cong!");
    } catch (error) {
      console.error("Error opening voting:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove voter
  const removeVoter = async (address) => {
    if (!contract) return alert("Contract chua ket noi!");

    try {
      setIsLoading(true);
      if (!isAddress(address)) {
        alert("Dia chi vi khong hop le!");
        return;
      }
      const tx = await contract.removeVoter(address);
      await tx.wait();
      alert("Xoa cu tri thanh cong!");
    } catch (error) {
      console.error("Error removing voter:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Init - chỉ chạy 1 lần khi mount
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0].toLowerCase());
          await loadBlockchainData();
        }

        // Event listeners
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0].toLowerCase());
            loadBlockchainData();
          } else {
            disconnectWallet();
          }
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      }
    };
    init();

    return () => {
      if (window.ethereum?.removeAllListeners) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []); // Chỉ chạy 1 lần

  // Check admin khi có currentAccount và adminAddress
  useEffect(() => {
    if (currentAccount && adminAddress) {
      setIsAdmin(currentAccount === adminAddress.toLowerCase());
    }
  }, [currentAccount, adminAddress]);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        contract,
        candidates,
        isLoading,
        vote,
        isAdmin,
        addCandidate,
        registerVoter,
        removeVoter,
        votingOpen,
        closeVoting,
        openVoting,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
