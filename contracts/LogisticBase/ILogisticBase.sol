pragma solidity ^0.5.0;


contract ILogisticBase {
    // Named accounts
    function _setName(address account, string memory name_) public;
    function getName(address account) public returns (string memory);
    function getAddress(string memory name) public returns (address);

    // Roles
    function addSupplier(address account, string calldata name_) external;
    function removeSupplier(address account) external;
    function renounceSupplier() external;
    function isSupplier(address account) public returns (bool);

    function addDeliveryMan(address account, string calldata name_) external;
    function removeDeliveryMan(address account) external;
    function renounceDeliveryMan() external;
    function isDeliveryMan(address account) public returns (bool);
    function _isSupplierOrDeliveryMan(address account) external returns (bool);

    function transferOwnership(address newOwner) external;
    address public owner;

    // Pausable
    event Paused(address account);
    event Unpaused(address account);
    function pause() public;
    function unpause() public;
}
