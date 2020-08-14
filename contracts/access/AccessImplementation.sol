pragma solidity ^0.5.5;

import "./AccessStorage.sol";
import "../commons/Ownable.sol";

// TODO: link the library

contract AccessImplementation is AccessStorage, Ownable {
    function addSupplier(address account) external onlyOwner {
        require(account != owner, "Access: Owner can't be supplier");
        logisticRoles.addSupplier(account);
    }

    function removeSupplier(address account) external onlyOwner {
        logisticRoles.removeSupplier(account);
    }

    function renounceSupplier() external {
        require(
            isSupplier(msg.sender),
            "Access: caller is not supplier"
        );
        logisticRoles.removeSupplier(msg.sender);
    }

    function addDeliveryMan(address account) external onlyOwner {
        require(account != owner, "Access: Owner can't be delivery man");
        logisticRoles.addDeliveryMan(account);
    }

    function removeDeliveryMan(address account) external onlyOwner {
        logisticRoles.removeDeliveryMan(account);
    }

    function renounceDeliveryMan() external {
        require(
            isDeliveryMan(msg.sender),
            "Access: caller is not delivery man"
        );
        logisticRoles.removeDeliveryMan(msg.sender);
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
