pragma solidity ^0.5.0;


contract Delegater {
    function degelateCallWithRevert(address _impl, bytes memory signature)
        internal
        returns (bytes memory result)
    {
        (bool success, bytes memory result) = address(this).delegatecall(signature);
        require(success, "Delegater: logic contract call failed");
        return result;


        // assembly {
        //     let success := delegatecall(sub(gas, 10000), _impl, add(signature, 0x20), mload(signature), 0, 0)
        //     let size := returndatasize
        //     let ptr := mload(0x40)
        //     returndatacopy(ptr, 0, size)
        //
        //     // revert instead of invalid() bc if the underlying call failed with invalid() it already wasted gas.
        //     // if the call returned error data, forward it
        //     switch success
        //     case 0 { revert(ptr, size) }
        //     // default { mstore(ptr, result) }
        //     default { let result := mload(ptr) }
        // }
        // return result;
    }

    function delegateCallProxy(address _impl) internal {
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
