pragma solidity ^0.5.0;

import "./ERC721.sol";


contract ERC721AutoIncrement is ERC721("LogisticM", "LM") {
    uint256 public counter = 1;

    function _mint(address to) internal {
        super._mint(to, counter);
        counter = counter.add(1);
    }
}
