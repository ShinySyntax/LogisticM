pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";


contract MakerRole {
    using Roles for Roles.Role;

    event MakerAdded(address indexed account);
    event MakerRemoved(address indexed account);

    Roles.Role private _maker;

    constructor () internal {
        _addMaker(msg.sender);
    }

    modifier onlyMaker() {
        require(isMaker(msg.sender), "MakerRole: caller does not have the Maker role");
        _;
    }

    function isMaker(address account) public view returns (bool) {
        return _maker.has(account);
    }

    function renounceMaker() public {
        _removeMaker(msg.sender);
    }

    function _addMaker(address account) internal {
        _maker.add(account);
        emit MakerAdded(account);
    }

    function _removeMaker(address account) internal {
        _maker.remove(account);
        emit MakerRemoved(account);
    }
}
