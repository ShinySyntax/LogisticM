pragma solidity ^0.5.0;

import "./NameEvents.sol";


contract NameInterface is NameEvents {
    function setName(address account, string calldata name) external;

    function getName(address account) external view returns (string memory);
    function getAddress(string calldata name) external view returns (address);
}
