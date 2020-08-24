pragma solidity ^0.5.0;


contract IUpgradeabilityProxy {
    function upgradeTo(string memory targetVersion) public;
    function implementation(bytes4 func) public view returns (address);
}
