pragma solidity ^0.5.0;


contract ProductEvents {
    event NewProduct(
        address indexed by,
        address indexed purchaser,
        bytes32 indexed productHash,
        string productName
    );

    event ProductShipped(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );

    event ProductReceived(
        address indexed from,
        address indexed by,
        bytes32 indexed productHash,
        string productName
    );
}
