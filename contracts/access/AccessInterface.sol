// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "./AccessEvents.sol";


/**
 * @title AccessInterface
 * @dev Defines the interface of the Access logic contract.
 */
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
