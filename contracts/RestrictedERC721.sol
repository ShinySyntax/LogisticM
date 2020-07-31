pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract RestrictedERC721 is ERC721Full {
    using SafeMath for uint256;

    bool internal _restrictedMode;

    uint256 private _counter;

    modifier whenNotRestrictedMode() {
        require(_restrictedMode == false,
            "Logistic: restricted mode activated"
        );
        _;
    }

    constructor() public ERC721Full("Logistic", "LM") {
        _restrictedMode = true;
        _counter = 0;
    }

    function approve(address to, uint256 tokenId) public whenNotRestrictedMode {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        revert("Logistic: cannot approve for all");
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    whenNotRestrictedMode {
        super._transferFrom(from, to, tokenId);
    }

    function _getCounter() internal view returns (uint256) {
        return _counter;
    }

    function _mint(address to) internal {
        super._safeMint(to, _counter);
        _counter = _counter.add(1);
    }
}
