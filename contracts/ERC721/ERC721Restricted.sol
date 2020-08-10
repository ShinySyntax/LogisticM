pragma solidity ^0.5.0;

import "./ERC721AutoIncrement.sol";


contract ERC721Restricted is ERC721AutoIncrement {
    bool private _restrictedMode = true;

    modifier whenNotRestrictedMode() {
        require(_restrictedMode == false,
            "Logistic: restricted mode activated"
        );
        _;
    }

    function approve(address to, uint256 tokenId) public whenNotRestrictedMode {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address, bool) public {
        revert("Logistic: cannot approve for all");
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    whenNotRestrictedMode {
        super._transferFrom(from, to, tokenId);
    }

    function _setRestricted(bool restricted) internal {
        _restrictedMode = restricted;
    }
}
