pragma solidity ^0.5.0;


contract HandoverEvents {
    event Handover(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );
}
