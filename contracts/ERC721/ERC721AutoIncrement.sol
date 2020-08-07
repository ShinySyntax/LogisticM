pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";


contract ERC721AutoIncrement is ERC721Full("LogisticM", "LM") {
    uint256 internal counter = 0;

    function _mint(address to) internal {
        super._mint(to, counter);
        counter = counter.add(1);
    }
}
