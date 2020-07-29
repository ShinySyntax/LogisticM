pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";


contract DeliveryManRole {
    using Roles for Roles.Role;

    event DeliveryManAdded(address indexed account, string name);
    event DeliveryManRemoved(address indexed account);

    Roles.Role private _deliveryMan;

    function isDeliveryMan(address account) public view returns (bool) {
        return _deliveryMan.has(account);
    }

    function renounceDeliveryMan() public {
        _removeDeliveryMan(msg.sender);
    }

    function _addDeliveryMan(address account, string memory name_) internal {
        _deliveryMan.add(account);
        emit DeliveryManAdded(account, name_);
    }

    function _removeDeliveryMan(address account) internal {
        _deliveryMan.remove(account);
        emit DeliveryManRemoved(account);
    }
}
