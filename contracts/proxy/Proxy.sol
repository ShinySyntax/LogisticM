pragma solidity ^0.5.0;

import "./Delegater.sol";


/**
 * @title Proxy
 * @dev Gives the possibility to delegate any call to a foreign implementation.
 */
contract Proxy is Delegater {
    /**
    * @dev Tells the address of the implementation where every call will be delegated.
    * @return address of the implementation to which it will be delegated
    */
    function implementation(bytes4 func) public view returns (address);

    /**
    * @dev Fallback function allowing to perform a delegatecall to the given implementation.
    * This function will return whatever the implementation call returns
    */
    function () external {
        address _impl = implementation(msg.sig);
        require(_impl != address(0), "Proxy: implementation not found");
        delegateCallProxy(_impl);
    }
}
