pragma solidity ^0.5.0;

import "./OwnerEvents.sol";


contract OwnerInterface is OwnerEvents {
    function transferOwnership(address newOwner) external;
    function getOwner() external view returns (address);
}
