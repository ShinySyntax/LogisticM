pragma solidity ^0.5.0;


contract Lock {
    modifier locked(bool lock) {
        require(lock == false, "Lock: locked");
        _;
    }
}
