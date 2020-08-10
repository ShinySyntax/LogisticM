pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Full.sol";

// Abstract contract

contract ILogisticToken is IERC721Full {
    function _setRestricted(bool restricted) public;
    function getCounter() public returns (uint256);
    function mint(address account) public;
}
