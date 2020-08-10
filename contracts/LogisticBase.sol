pragma solidity ^0.5.0;

import "./ILogisticBase.sol";
import "./ProductManager.sol";


contract LogisticBase is ILogisticBase, ProductManager {
    address public logistic;

    modifier onlyLogistic() {
        require(msg.sender == logistic, "Caller is not Logistic");
        _;
    }

    function approve(address to, uint256 tokenId) public onlyLogistic {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        revert("Logistic: cannot approve for all");
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    onlyLogistic {
        super._transferFrom(from, to, tokenId);
    }

    function setLogistic(address newLogistic) external onlyOwner {
        logistic = newLogistic;
    }

    function setName(address account, string calldata name) external onlyLogistic {
        _setName(account, name);
    }

    function pause() public onlyLogistic {
        _pause();
    }

    function unpause() public onlyLogistic {
        _unpause();
    }

    function newProduct(
        address supplier,
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        string calldata productName
    )
        external
        onlyLogistic
    {
        _newProduct(supplier, productHash, purchaser, tokenId, productName);
    }

    function setProductSent(bytes32 productHash, address from, address to)
        external
        onlyLogistic
    {
        _setProductSent(productHash, from, to);
    }

    function setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        external
        onlyLogistic
    {
        _setProductReceived(productHash, from, by);
    }
}
