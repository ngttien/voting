// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Contract cho mỗi cuộc bầu cử
contract Voting {
    struct Candidate {
        uint id;
        string name;
        address candidateAddress;
        uint voteCount;
    }
    
    struct Voter {
        string name;
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }

    address public admin;
    string public votingTitle; // Tên cuộc bầu cử
    string public description; // Mô tả
    uint public candidatesCount;
    bool public votingOpen;
    uint public createdAt;
    
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    
    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);
    event VotingClosed();
    event VotingOpened();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi duoc thuc hien");
        _;
    }

    constructor(address _admin, string memory _title, string memory _description) {
        admin = _admin;
        votingTitle = _title;
        description = _description;
        votingOpen = true;
        createdAt = block.timestamp;
    }

    function addCandidate(string memory _name, address _candidateAddress) public onlyAdmin {
        require(_candidateAddress != address(0), "Dia chi ung vien khong hop le");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _candidateAddress, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint _candidateId) public {
        require(votingOpen, "Bau cu da dong");
        require(msg.sender != admin, "Admin khong duoc phep bo phieu");
        
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Ban da bo phieu roi");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Ung vien khong hop le");

        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;
        
        if (!sender.isRegistered) {
            sender.isRegistered = true;
            sender.name = "Anonymous";
        }
        
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory list = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            list[i - 1] = candidates[i];
        }
        return list;
    }

    function closeVoting() public onlyAdmin {
        votingOpen = false;
        emit VotingClosed();
    }
    
    function openVoting() public onlyAdmin {
        votingOpen = true;
        emit VotingOpened();
    }

    function hasVoted(address _voterAddress) public view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }

    function getVotingInfo() public view returns (
        string memory title,
        string memory desc,
        address adminAddr,
        uint candidateCount,
        bool isOpen,
        uint created
    ) {
        return (votingTitle, description, admin, candidatesCount, votingOpen, createdAt);
    }
}

// Factory Contract - Quản lý tất cả cuộc bầu cử
contract VotingFactory {
    address[] public votings; // Danh sách tất cả cuộc bầu cử
    mapping(address => address[]) public userVotings; // Cuộc bầu cử của mỗi user
    
    event VotingCreated(address votingAddress, address admin, string title);

    // Tạo cuộc bầu cử mới
    function createVoting(string memory _title, string memory _description) public returns (address) {
        Voting newVoting = new Voting(msg.sender, _title, _description);
        address votingAddress = address(newVoting);
        
        votings.push(votingAddress);
        userVotings[msg.sender].push(votingAddress);
        
        emit VotingCreated(votingAddress, msg.sender, _title);
        return votingAddress;
    }

    // Lấy tất cả cuộc bầu cử
    function getAllVotings() public view returns (address[] memory) {
        return votings;
    }

    // Lấy số lượng cuộc bầu cử
    function getVotingsCount() public view returns (uint) {
        return votings.length;
    }

    // Lấy cuộc bầu cử của user
    function getMyVotings() public view returns (address[] memory) {
        return userVotings[msg.sender];
    }
}