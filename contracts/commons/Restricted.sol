pragma solidity ^0.5.0;


contract Restricted {
    bool internal lock = true;

    modifier restricted() {
        require(lock == false,
            "Logistic: restricted mode activated"
        );
        _;
    }
}
