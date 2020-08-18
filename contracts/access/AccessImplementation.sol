pragma solidity ^0.5.5;

import "../logistic/LogisticSharedStorage.sol";
import "./AccessEvents.sol";
import "./AccessStorage.sol";


contract AccessImplementation is
    AccessEvents,
    LogisticSharedStorage {
    function addSupplier(address account) external {
        // require(account != owner, "Access: Owner can't be supplier");
        logisticRoles.addSupplier(account);
        emit SupplierAdded(account);
    }

    function removeSupplier(address account) external {
        logisticRoles.removeSupplier(account);
        emit SupplierRemoved(account);
    }

    function renounceSupplier() external {
        require(
            isSupplier(msg.sender),
            "Access: caller is not supplier"
        );
        logisticRoles.removeSupplier(msg.sender);
        emit SupplierRemoved(msg.sender);
    }

    function addDeliveryMan(address account) external {
        // require(account != owner, "Access: Owner can't be delivery man");
        logisticRoles.addDeliveryMan(account);
        emit DeliveryManAdded(account);
    }

    function removeDeliveryMan(address account) external {
        logisticRoles.removeDeliveryMan(account);
        emit DeliveryManRemoved(account);
    }

    function renounceDeliveryMan() external {
        require(
            isDeliveryMan(msg.sender),
            "Access: caller is not delivery man"
        );
        logisticRoles.removeDeliveryMan(msg.sender);
        emit DeliveryManRemoved(msg.sender);
    }

    function getRole(address account)
        external
        view
        returns (uint256)
    {
        // if (account == owner) {
        //     return uint256(RolesLibrary.RoleNames.Owner);
        // }
        if (isSupplier(account)) {
            return uint256(RolesLibrary.RoleNames.Supplier);
        }
        if (isDeliveryMan(account)) {
            return uint256(RolesLibrary.RoleNames.DeliveryMan);
        }
        return uint256(RolesLibrary.RoleNames.Nobody);
    }

    function isSupplier(address account) public view returns (bool) {
        return logisticRoles.isSupplier(account);
    }

    function isDeliveryMan(address account) public view returns (bool) {
        return logisticRoles.isDeliveryMan(account);
    }
}
