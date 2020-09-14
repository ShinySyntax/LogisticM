// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./HandoverEvents.sol";


/**
 * @title HandoverInterface
 * @dev Define the interface of the Handover logic contract.
 */
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
