pragma solidity ^0.5.0;

import "./ERC721AutoIncrement.sol";


contract ERC721Restricted is ERC721AutoIncrement {
    bool private _restrictedMode = true;

    address private _owner;

    modifier whenNotRestrictedMode() {
        require(_restrictedMode == false,
            "Logistic: restricted mode activated"
        );
        _;
    }

    constructor() public {
        _owner = msg.sender;
    }

    function _setRestricted(bool restricted) public {
        require(msg.sender == _owner);
        _restrictedMode = restricted;
    }

    function approve(address to, uint256 tokenId) public whenNotRestrictedMode {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, bool) public {
        revert("Logistic: cannot approve for all");
    }

    function mint(address to) public {
        require(msg.sender == _owner);
        super._mint(to, counter);
        counter = counter.add(1);
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    whenNotRestrictedMode {
        super._transferFrom(from, to, tokenId);
    }
}
