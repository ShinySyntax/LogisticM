pragma solidity ^0.5.0;

import "./HandoverEvents.sol";


contract HandoverInterface is HandoverEvents {
    function createProduct(
        address purchaser,
        bytes32 productHash,
        bytes32 productNameBytes32,
        bytes32 purchaserNameBytes32
    ) external;

    function send(address to, bytes32 productHash) external;
    function receive(address from, bytes32 productHash) external;
}
