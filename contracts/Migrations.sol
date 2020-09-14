// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;


contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }
}
