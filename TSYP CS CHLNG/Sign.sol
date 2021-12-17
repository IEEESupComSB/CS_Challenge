// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.7.0 <0.9.0;
contract sign{
    mapping (address => bool) private admins;
    constructor(){
        admins[msg.sender] = true;//when smart contract is deployed, you become admin.
    }


    mapping (bytes32 => uint256) private verified;//maps every document's hash to the time it was verified (since epoch).
    
    function addAdmin(address _adminAdress) public isAdmin{
        admins[_adminAdress] = true;
    }

    modifier isAdmin(){//verifies admin permissions
        require(admins[msg.sender] == true,"you're not allowed. You need admin permissions.");
        _;
    }

    function verifyAdmin(address _adminAdress) public view returns(bool){
        return admins[_adminAdress];
    }

    function verify(bytes32 _hash) public view returns(uint256){
        return verified[_hash];
    }


    function add(bytes32 _hash) public isAdmin{//authenticate a document
        require(verified[_hash]==0,"This document is already verified");
        verified[_hash] = block.timestamp;
    }
