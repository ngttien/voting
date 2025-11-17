// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    // -------------------------------
    // Structs
    // -------------------------------
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint votedCandidateId;
    }

    struct User {
        uint id;
        string name;
    }

    // -------------------------------
    // State variables
    // -------------------------------
    address public admin;

    uint public candidatesCount;
    mapping(uint => Candidate) candidates;

    mapping(address => Voter) voters;

    uint public usersCount;
    mapping(uint => User) users;

    // -------------------------------
    // Events
    // -------------------------------
    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);
    event UserAdded(uint id, string name);

    // -------------------------------
    // Modifiers
    // -------------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi duoc thuc hien");
        _;
    }

    // -------------------------------
    // Constructor
    // -------------------------------
    constructor() {
        admin = msg.sender;
    }

    // -------------------------------
    // Candidate functions
    // -------------------------------
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

    // -------------------------------
    // Voting functions
    // -------------------------------
    function vote(uint _candidateId) public {
        require(!voters[msg.sender].hasVoted, "Ban da bo phieu roi");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Ung vien khong hop le");

        voters[msg.sender] = Voter(true, _candidateId);
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].hasVoted;
    }

    function getVoter(address _voter) public view returns (Voter memory) {
        return voters[_voter];
    }

    // -------------------------------
    // User functions
    // -------------------------------
    function addUser(uint _id, string memory _name) public onlyAdmin {
        require(bytes(users[_id].name).length == 0, "User da ton tai");
        users[_id] = User(_id, _name);
        usersCount++;
        emit UserAdded(_id, _name);
    }

    function getUser(uint _id) public view returns (User memory) {
        require(bytes(users[_id].name).length != 0, "User khong ton tai");
        return users[_id];
    }

    function getAllUsers() public view returns (User[] memory) {
        User[] memory list = new User[](usersCount);
        uint counter = 0;
        for(uint i = 1; i <= usersCount; i++){
            if(bytes(users[i].name).length != 0){ 
                list[counter] = users[i];
                counter++;
            }
        }
        return list;
    }

    function updateUser(uint _id, string memory _name) public onlyAdmin {
        require(bytes(users[_id].name).length != 0, "User khong ton tai");
        users[_id].name = _name;
    }

    function deleteUser(uint _id) public onlyAdmin {
        require(bytes(users[_id].name).length != 0, "User khong ton tai");
        delete users[_id];
        if(usersCount > 0) usersCount--;
    }
}
