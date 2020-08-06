pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract ERC721AutoIncrement is ERC721 {
    using SafeMath for uint256;

    uint256 private _counter;

    constructor() public {
        _counter = 0;
    }

    function _getCounter() internal view returns (uint256) {
        return _counter;
    }

    function _mint(address to) internal {
        super._mint(to, _counter);
        _counter = _counter.add(1);
    }
}
