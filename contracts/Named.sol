pragma solidity ^0.5.0;


contract Named {
    // User (address) is named (string)
    mapping (address => string) internal _names;

    // name (string) refer to user (address)
    mapping (string => address) internal _addresses;

    function name(address account) public view returns (string memory) {
        return _names[account];
    }

    function addressByName(string memory name_) public view returns (address) {
        return _addresses[name_];
    }

    function _setName(address account, string memory name_) internal {
        assert(keccak256(bytes(_names[account])) == keccak256("")); // TODO: pause the contract
        _names[account] = name_;
        _addresses[name_] = account;
    }
}
