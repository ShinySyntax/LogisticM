pragma solidity ^0.5.0;


contract LogisticEvents {
    event Handover(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );

    event DCall(address addr);
}
