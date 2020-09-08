pragma solidity ^0.5.0;

import "./NameEvents.sol";


/**
 * @title NameInterface
 * @dev Define the interface of the Name logic contract.
 */
contract NameInterface is NameEvents {
    function setName(address account, bytes32 nameBytes32) external;

    function getName(address account) external view returns (string memory);
    function getAddress(bytes32 nameBytes32) external view returns (address);
}
