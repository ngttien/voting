
pragma solidity ^0.8.20;

contract Voting {
   
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
  
    struct Voter {
        string name;
        bool isRegistered; // = true nếu được Admin đăng ký
        bool hasVoted;
        uint votedCandidateId;
    }


    address public admin;
    uint public candidatesCount;
    
    mapping(uint => Candidate) public candidates;
    
    mapping(address => Voter) public voters;// dùng address làm khóa chính cho cử tri (voter)
    // Events
    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);
    
    // Event mới cho việc đăng ký
    event VoterRegistered(address voterAddress, string name);
    event VoterRemoved(address voterAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi duoc thuc hien");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function getCandidate(uint _id) public view returns (Candidate memory) {
        require(_id > 0 && _id <= candidatesCount, "Ung vien khong ton tai");
        return candidates[_id];
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory list = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            list[i - 1] = candidates[i];
        }
        return list;
    }

  //voting function
   
    function vote(uint _candidateId) public {
        // Lấy thông tin người gọi (msg.sender) //cái này quan trọng nè mấy má
        Voter storage sender = voters[msg.sender];

       
        require(sender.isRegistered, "Ban khong co trong danh sach duoc phep bo phieu");
        require(!sender.hasVoted, "Ban da bo phieu roi");
      

        require(_candidateId > 0 && _candidateId <= candidatesCount, "Ung vien khong hop le");

        // Cập nhật state của cử tri
        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;
        
        // Cập nhật state của ứng viên
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

  
    //Đăng ký cử tri vào Whitelist
    //Chỉ Admin được gọi
  
    function registerVoter(address _voterAddress, string memory _name) public onlyAdmin {
        require(!voters[_voterAddress].isRegistered, "Cu tri nay da duoc dang ky");
        voters[_voterAddress] = Voter(_name, true, false, 0);
        emit VoterRegistered(_voterAddress, _name);
    }


    function removeVoter(address _voterAddress) public onlyAdmin {
        require(voters[_voterAddress].isRegistered, "Cu tri khong ton tai");
        delete voters[_voterAddress];
        emit VoterRemoved(_voterAddress);
    }
    
   
    function getVoter(address _voterAddress) public view returns (Voter memory) {
        require(voters[_voterAddress].isRegistered, "Cu tri khong ton tai");
        return voters[_voterAddress];
    }
    
      function hasVoted(address _voterAddress) public view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }
}