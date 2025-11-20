import React, { createContext, useState, useEffect } from "react";
import { BrowserProvider, Contract, isAddress } from "ethers";

export const VotingFactoryContext = createContext();

const SEPOLIA_NETWORK_ID = "11155111";

// Import ABIs
import VotingFactoryABI from "../contracts/VotingFactory.json";
import VotingABI from "../contracts/Voting.json";

const factoryAddress = VotingFactoryABI.networks?.[SEPOLIA_NETWORK_ID]?.address;
const factoryABI = VotingFactoryABI.abi || [];
const votingABI = VotingABI.abi || [];

console.log("Factory Address:", factoryAddress);
console.log("Factory ABI length:", factoryABI.length);

export const VotingFactoryProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [currentVotingContract, setCurrentVotingContract] = useState(null);
  const [currentVotingAddress, setCurrentVotingAddress] = useState(null);
  
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true);
  const [votingInfo, setVotingInfo] = useState(null);

  // Tạo provider và signer
  const getProviderAndSigner = async () => {
    if (!window.ethereum) return null;
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

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
      return { provider, signer };
    } catch (error) {
      console.error("Error getting provider:", error);
      return null;
    }
  };

  // Khởi tạo Factory Contract
  const initFactoryContract = async () => {
    if (!factoryAddress) {
      console.error("Factory contract chưa được deploy!");
      return null;
    }

    const result = await getProviderAndSigner();
    if (!result) return null;

    try {
      const factory = new Contract(factoryAddress, factoryABI, result.signer);
      setFactoryContract(factory);
      return factory;
    } catch (error) {
      console.error("Error initializing factory:", error);
      return null;
    }
  };

  // Tạo cuộc bầu chọn mới
  const createVoting = async (title, description) => {
    if (!factoryAddress) {
      alert("VotingFactory chưa được deploy! Vui lòng deploy contract trước.");
      return false;
    }

    try {
      setIsLoading(true);
      
      const contract = factoryContract || await initFactoryContract();
      if (!contract) {
        alert("Không thể kết nối với contract!");
        return false;
      }

      const tx = await contract.createVoting(title, description);
      const receipt = await tx.wait();
      
      // Lấy địa chỉ voting mới từ event
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === "VotingCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = contract.interface.parseLog(event);
        await selectVoting(parsed.args.votingAddress);
      }

      return true;
    } catch (error) {
      console.error("Error creating voting:", error);
      alert(error.reason || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy tất cả cuộc bầu chọn
  const getAllVotings = async () => {
    if (!factoryAddress) {
      console.error("VotingFactory chưa được deploy!");
      return [];
    }

    try {
      const contract = factoryContract || await initFactoryContract();
      if (!contract) return [];

      const addresses = await contract.getAllVotings();
      const result = await getProviderAndSigner();
      if (!result) return [];

      const votingsList = await Promise.all(
        addresses.map(async (addr) => {
          try {
            const votingContract = new Contract(addr, votingABI, result.signer);
            const info = await votingContract.getVotingInfo();
            
            return {
              address: addr,
              title: info.title,
              description: info.desc,
              admin: info.adminAddr,
              candidateCount: Number(info.candidateCount),
              isOpen: info.isOpen,
              createdAt: new Date(Number(info.created) * 1000).toLocaleString('vi-VN'),
              isAdmin: currentAccount && info.adminAddr.toLowerCase() === currentAccount.toLowerCase()
            };
          } catch (error) {
            console.error(`Error loading voting ${addr}:`, error);
            return null;
          }
        })
      );

      return votingsList.filter(v => v !== null);
    } catch (error) {
      console.error("Error getting all votings:", error);
      return [];
    }
  };

  // Chọn một cuộc bầu chọn để tham gia
  const selectVoting = async (votingAddress) => {
    const result = await getProviderAndSigner();
    if (!result) {
      alert("Không thể kết nối ví!");
      return false;
    }

    try {
      const votingContract = new Contract(votingAddress, votingABI, result.signer);
      setCurrentVotingContract(votingContract);
      setCurrentVotingAddress(votingAddress);
      
      // Load thông tin voting
      await loadVotingData(votingContract);
      
      return true;
    } catch (error) {
      console.error("Error selecting voting:", error);
      alert("Không thể kết nối với cuộc bầu chọn này!");
      return false;
    }
  };

  // Load dữ liệu của voting hiện tại
  const loadVotingData = async (contract = currentVotingContract) => {
    if (!contract) return;

    try {
      // Load thông tin cơ bản
      const info = await contract.getVotingInfo();
      setVotingInfo({
        title: info.title,
        description: info.desc,
        admin: info.adminAddr,
        candidateCount: Number(info.candidateCount),
        isOpen: info.isOpen,
        createdAt: new Date(Number(info.created) * 1000).toLocaleString('vi-VN')
      });

      setVotingOpen(info.isOpen);
      
      // Check admin
      if (currentAccount) {
        setIsAdmin(currentAccount.toLowerCase() === info.adminAddr.toLowerCase());
      }

      // Load candidates
      if (Number(info.candidateCount) > 0) {
        const allCandidates = await contract.getAllCandidates();
        const formatted = allCandidates.map(c => ({
          id: Number(c.id),
          name: c.name,
          candidateAddress: c.candidateAddress,
          voteCount: Number(c.voteCount)
        }));
        setCandidates(formatted);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error("Error loading voting data:", error);
    }
  };

  // Bỏ phiếu
  const vote = async (candidateId) => {
    if (!currentVotingContract) {
      alert("Chưa chọn cuộc bầu chọn!");
      return;
    }

    try {
      setIsLoading(true);
      const tx = await currentVotingContract.vote(candidateId);
      await tx.wait();
      await loadVotingData();
      alert("Bỏ phiếu thành công!");
    } catch (error) {
      console.error("Error voting:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm ứng viên (Admin only)
  const addCandidate = async (name, address) => {
    if (!currentVotingContract) {
      alert("Chưa chọn cuộc bầu chọn!");
      return;
    }

    if (!isAddress(address)) {
      alert("Địa chỉ ví ứng viên không hợp lệ!");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const tx = await currentVotingContract.addCandidate(name, address);
      await tx.wait();
      await loadVotingData();
      alert("Thêm ứng viên thành công!");
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Đóng/Mở bầu cử (Admin only)
  const toggleVoting = async (shouldClose) => {
    if (!currentVotingContract) return;

    try {
      setIsLoading(true);
      const tx = shouldClose 
        ? await currentVotingContract.closeVoting()
        : await currentVotingContract.openVoting();
      await tx.wait();
      await loadVotingData();
      alert(shouldClose ? "Đã đóng bầu cử thành công!" : "Đã mở bầu cử thành công!");
    } catch (error) {
      console.error("Error toggling voting:", error);
      alert(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeVoting = () => toggleVoting(true);
  const openVoting = () => toggleVoting(false);

  // Kết nối ví
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0].toLowerCase();
      setCurrentAccount(account);
      
      await initFactoryContract();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Ngắt kết nối
  const disconnectWallet = () => {
    setCurrentAccount(null);
    setFactoryContract(null);
    setCurrentVotingContract(null);
    setCurrentVotingAddress(null);
    setCandidates([]);
    setIsAdmin(false);
    setVotingInfo(null);
  };

  // Init
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0].toLowerCase());
          await initFactoryContract();
        }

        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0].toLowerCase());
            initFactoryContract();
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
  }, []);

  // Reload voting data khi account thay đổi
  useEffect(() => {
    if (currentVotingContract && currentAccount) {
      loadVotingData();
    }
  }, [currentAccount]);

  return (
    <VotingFactoryContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        createVoting,
        getAllVotings,
        selectVoting,
        currentVotingAddress,
        votingInfo,
        candidates,
        isLoading,
        vote,
        isAdmin,
        addCandidate,
        votingOpen,
        closeVoting,
        openVoting,
      }}
    >
      {children}
    </VotingFactoryContext.Provider>
  );
};
