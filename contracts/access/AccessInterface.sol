pragma solidity ^0.5.0;

import "./AccessEvents.sol";


contract AccessInterface is AccessEvents {
    function addSupplierWithName(address account, bytes32 nameBytes32) external;
    function addSupplier(address account) external;
    function removeSupplier(address account) external;
    function renounceSupplier() external;

    function addDeliveryManWithName(address account, bytes32 nameBytes32) external;
    function addDeliveryMan(address account) external;
    function removeDeliveryMan(address account) external;
    function renounceDeliveryMan() external;

    function getRole(address account) external view returns (uint256);
    function isSupplier(address account) public view returns (bool);
    function isDeliveryMan(address account) public view returns (bool);
}
