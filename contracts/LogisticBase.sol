pragma solidity ^0.5.0;

import "./ProductManager.sol";


contract LogisticBase is ProductManager {
    address public logistic;

    event TestCall(address caller, address owern, address logistic);

    modifier onlyLogistic() {
        require(msg.sender == logistic, "Caller is not Logistic");
        _;
    }

    function howIAm(uint256 a) external view returns (address, uint256, address, address, address) {
        return (msg.sender, a, logistic, owner, tx.origin);
    }

    function howIsCalling() external {
        emit TestCall(msg.sender, owner, logistic);
        // if (msg.sender == owner) {
        //     revert("owner!");
        // }
        // if (msg.sender == logistic) {
        //     revert("logistic");
        // }
        // if (msg.sender == address(0)) {
        //     revert("0 is calling");
        // }
        // revert("i don't know who is calling");
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
