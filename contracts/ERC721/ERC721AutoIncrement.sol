pragma solidity ^0.5.0;

import "./ERC721.sol";


contract ERC721AutoIncrement is ERC721("LogisticM", "LM") {
    uint256 public counter = 1;

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
