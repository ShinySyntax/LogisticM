pragma solidity ^0.5.0;


/**
 * @title Proxy
 * @dev Gives the possibility to delegate any call to a foreign implementation.
 */
contract Proxy {
    /**
    * @dev Fallback function allowing to perform a delegatecall to the given implementation.
    * This function will return whatever the implementation call returns
    */
    function() external {
        address impl = implementation(msg.sig);
        require(impl != address(0), "Proxy: implementation not found");
        delegateCallProxy(impl);
    }

    /**
    * @dev Tells the address of the implementation where every call will be delegated.
    * @return address of the implementation to which it will be delegated
    */
    function implementation(bytes4 func) public view returns (address);

    /**
    * @dev This function is called by the fallback funcion and performs a
    * delegatecall to the given implementation.
    * This function will return whatever the implementation call returns
    */
    function delegateCallProxy(address impl) internal {
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
