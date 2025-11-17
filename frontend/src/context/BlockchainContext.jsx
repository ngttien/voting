import React, { createContext, useState, useEffect } from "react";
// === SỬA LỖI 1: Import đúng cú pháp Ethers v6 ===
import { BrowserProvider, Contract, isAddress } from "ethers";
import VotingContract from "../contracts/Voting.json"; // Đảm bảo file này đã được cập nhật!

export const BlockchainContext = createContext();

// Lấy provider từ MetaMask
const { ethereum } = window;

// Lấy địa chỉ contract từ file ABI
const contractAddress =
  VotingContract.networks[Object.keys(VotingContract.networks)[0]].address;
const contractABI = VotingContract.abi;

// === SỬA LỖI 2: Cập nhật hàm getContract theo Ethers v6 ===
const getContract = async () => {
  if (!ethereum) {
    console.log("Vui long cai dat MetaMask!");
    return null;
  }

  // Ethers v6 dùng 'BrowserProvider' thay vì 'ethers.providers.Web3Provider'
  const provider = new BrowserProvider(ethereum);
  // getSigner() trong v6 là một hàm async
  const signer = await provider.getSigner();
  // Ethers v6 dùng 'Contract' (đã import) thay vì 'ethers.Contract'
  const votingContract = new Contract(contractAddress, contractABI, signer);

  return { contract: votingContract, provider: provider };
};

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  // const [provider, setProvider] = useState(null); // Có thể giữ lại nếu cần
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State cho Admin
  const [adminAddress, setAdminAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Hàm kiểm tra và tải dữ liệu ban đầu
  const loadBlockchainData = async () => {
    try {
      // getContract() giờ là async
      const contractData = await getContract();
      if (!contractData) return;

      setContract(contractData.contract);
      // setProvider(contractData.provider);

      // Tải danh sách ứng viên
      const allCandidates = await contractData.contract.getAllCandidates();
      setCandidates(formatCandidates(allCandidates));

      // Tải địa chỉ Admin
      const admin = await contractData.contract.admin();
      const adminAddr = admin.toLowerCase();
      setAdminAddress(adminAddr);

      // Kiểm tra admin nếu đã kết nối
      if (currentAccount) {
        checkIfAdmin(currentAccount, adminAddr);
      }
    } catch (error) {
      console.error("Loi khi tai du lieu blockchain: ", error);
    }
  };

  // Hàm kết nối ví
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Vui long cai dat MetaMask!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        const account = accounts[0].toLowerCase();
        setCurrentAccount(account);

        // Tải lại dữ liệu (bao gồm cả check admin) sau khi kết nối
        await loadBlockchainData();
      } else {
        console.log("Khong tim thay tai khoan nao.");
      }
    } catch (error) {
      console.error("Loi khi ket noi vi: ", error);
    }
  };

  // Hàm kiểm tra admin (để dùng lại)
  const checkIfAdmin = (account, admin) => {
    if (account && admin && account === admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Tự động tải lại khi đổi tài khoản
  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          const account = accounts[0].toLowerCase();
          setCurrentAccount(account);
          // Cập nhật lại quyền admin khi đổi tài khoản
          checkIfAdmin(account, adminAddress);
        } else {
          setCurrentAccount(null);
          setIsAdmin(false);
        }
      });
    }

    loadBlockchainData();
  }, [adminAddress]); // Chạy lại khi adminAddress được set

  // Định dạng lại dữ liệu ứng viên (Ethers v6 trả về BigInt)
  const formatCandidates = (candidatesArray) => {
    return candidatesArray.map((candidate) => ({
      id: Number(candidate.id), // Chuyển BigInt sang Number
      name: candidate.name,
      voteCount: Number(candidate.voteCount), // Chuyển BigInt sang Number
    }));
  };

  // === HÀM CHO CỬ TRI (VOTER) ===
  const vote = async (candidateId) => {
    if (!contract || !currentAccount) return;

    try {
      setIsLoading(true);
      const tx = await contract.vote(candidateId);
      await tx.wait();
      setIsLoading(false);

      loadBlockchainData();
      alert("Bo phieu thanh cong!");
    } catch (error) {
      setIsLoading(false);
      console.error("Loi khi bo phieu:", error);
      // Lỗi Ethers v6 thường nằm trong 'reason'
      alert(error.reason || error.message);
    }
  };

  // === HÀM MỚI CHO ADMIN ===
  const addCandidate = async (name) => {
    if (!contract || !isAdmin) return alert("Ban khong phai Admin!");

    try {
      setIsLoading(true);
      const tx = await contract.addCandidate(name);
      await tx.wait();
      setIsLoading(false);
      loadBlockchainData();
      alert("Them ung vien thanh cong!");
    } catch (error) {
      setIsLoading(false);
      console.error("Loi khi them ung vien:", error);
      alert(error.reason || error.message);
    }
  };

  const registerVoter = async (address, name) => {
    if (!contract || !isAdmin) return alert("Ban khong phai Admin!");

    try {
      setIsLoading(true);

      // === SỬA LỖI 3: Dùng isAddress() ===
      // Ethers v6 dùng 'isAddress()' (đã import) thay vì 'ethers.utils.isAddress'
      if (!isAddress(address)) {
        alert("Dia chi vi khong hop le!");
        setIsLoading(false);
        return;
      }

      const tx = await contract.registerVoter(address, name);
      await tx.wait();
      setIsLoading(false);
      alert("Dang ky cu tri thanh cong!");
    } catch (error) {
      setIsLoading(false);
      console.error("Loi khi dang ky cu tri:", error);
      alert(error.reason || error.message);
    }
  };

  // Hàm xóa cử tri (thêm từ lần trước)
  const removeVoter = async (address) => {
    if (!contract || !isAdmin) return alert("Ban khong phai Admin!");

    try {
      setIsLoading(true);
      // Dùng isAddress (v6)
      if (!isAddress(address)) {
        alert("Dia chi vi khong hop le!");
        setIsLoading(false);
        return;
      }

      const tx = await contract.removeVoter(address);
      await tx.wait();
      setIsLoading(false);
      alert("Xoa cu tri thanh cong!");
    } catch (error) {
      setIsLoading(false);
      console.error("Loi khi xoa cu tri:", error);
      alert(error.reason || error.message);
    }
  };

  // Hàm cung cấp (provide) các giá trị
  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        contract,
        candidates,
        isLoading,
        vote,

        // Cung cấp giá trị mới
        isAdmin,
        addCandidate,
        registerVoter,
        removeVoter, // Đảm bảo hàm xóa cũng được cung cấp
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
