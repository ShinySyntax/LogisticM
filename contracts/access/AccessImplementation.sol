pragma solidity ^0.5.5;

import "../logistic/LogisticSharedStorage.sol";
import "./AccessInterface.sol";
import "../commons/Ownable.sol";
import "../upgradeability/ImplementationBase.sol";


/**
 * @title AccessImplementation
 * @dev The Access logic contract. This defines functions for user role
 * management.
 */
contract AccessImplementation is
    AccessInterface,
    LogisticSharedStorage,
    Ownable,
    ImplementationBase {

    constructor(address registry, string memory _version) public ImplementationBase(registry, _version) {}

    function addSupplierWithName(address account, bytes32 nameBytes)
        external
        onlyOwner(owner)
    {
        addSupplier(account);
        dCall(abi.encodeWithSignature(
            "setName(address,bytes32)",
            account,
            nameBytes
        ));
    }

    function removeSupplier(address account) external onlyOwner(owner) {
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

    function addDeliveryManWithName(address account, bytes32 nameBytes)
        external
        onlyOwner(owner)
    {
        addDeliveryMan(account);
        dCall(abi.encodeWithSignature(
            "setName(address,bytes32)",
            account,
            nameBytes
        ));
    }

    function removeDeliveryMan(address account) external onlyOwner(owner) {
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
        if (account == owner) {
            return uint256(RolesLibrary.RoleNames.Owner);
        }
        if (isSupplier(account)) {
            return uint256(RolesLibrary.RoleNames.Supplier);
        }
        if (isDeliveryMan(account)) {
            return uint256(RolesLibrary.RoleNames.DeliveryMan);
        }
        return uint256(RolesLibrary.RoleNames.Nobody);
    }

    function addSupplier(address account) public onlyOwner(owner) {
        require(account != owner, "Access: Owner can't be supplier");
        logisticRoles.addSupplier(account);
        emit SupplierAdded(account);
    }

    function addDeliveryMan(address account) public onlyOwner(owner) {
        require(account != owner, "Access: Owner can't be delivery man");
        logisticRoles.addDeliveryMan(account);
        emit DeliveryManAdded(account);
    }

    function isSupplier(address account) public view returns (bool) {
        return logisticRoles.isSupplier(account);
    }

    function isDeliveryMan(address account) public view returns (bool) {
        return logisticRoles.isDeliveryMan(account);
    }
}
