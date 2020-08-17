pragma solidity ^0.5.5;

import "./AccessStorage.sol";
import "./owner/OwnerStorage.sol";
import "../commons/Ownable.sol";


contract AccessImplementation is AccessStorage, Ownable {
    function addSupplier(address account) external {
        emit SupplierAdded(owner);
        require(account != owner, "Access: Owner can't be supplier");
        logisticRoles.addSupplier(account);
        emit SupplierAdded(account);
    }

    function removeSupplier(address account) external onlyOwner {
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

    function addDeliveryMan(address account) external onlyOwner {
        require(account != owner, "Access: Owner can't be delivery man");
        logisticRoles.addDeliveryMan(account);
        emit DeliveryManAdded(account);
    }

    function removeDeliveryMan(address account) external onlyOwner {
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
        returns (RolesLibrary.RoleNames)
    {
        if (account == owner) {
            return RolesLibrary.RoleNames.Owner;
        }
        if (isSupplier(account)) {
            return RolesLibrary.RoleNames.Supplier;
        }
        if (isDeliveryMan(account)) {
            return RolesLibrary.RoleNames.DeliveryMan;
        }
        return RolesLibrary.RoleNames.Nobody;
    }

    function isSupplier(address account) public view returns (bool) {
        return logisticRoles.isSupplier(account);
    }

    function isDeliveryMan(address account) public view returns (bool) {
        return logisticRoles.isDeliveryMan(account);
    }
}
