pragma solidity ^0.5.0;


contract MockImplementationV0 {
    function () external {}

    function myMethod() public {}

    function thisMethodReverts() public {
        revert("I reverts");
    }
}
