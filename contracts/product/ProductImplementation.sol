pragma solidity ^0.5.0;

import "../logistic/LogisticSharedStorage.sol";
import "./ProductInterface.sol";
import "../commons/Restricted.sol";


contract ProductImplementation is ProductInterface, LogisticSharedStorage, Restricted {
    function newProduct(
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        string memory productName
    )
        public
        restricted
    {
        tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
        emit NewProduct(msg.sender, purchaser, productHash, productName);
    }

    function setProductSent(
        bytes32 productHash,
        address from,
        address to,
        string memory productName
    )
        public
        restricted
    {
        _getProduct(productHash).sent[from] = to;
        emit ProductShipped(msg.sender, to, productHash, productName);
    }

    function setProductReceived(
        bytes32 productHash,
        address from,
        address by,
        string memory productName
    )
        public
        restricted
    {
        _getProduct(productHash).received[from] = by;
        emit ProductReceived(from, msg.sender, productHash, productName);
    }

    function getProductInfo(bytes32 productHash)
        public
        view
        returns (
            address purchaser,
            uint256 tokenId,
            string memory productName
        )
    {
        return (
            _getProduct(productHash).purchaser,
            _getProduct(productHash).tokenId,
            _getProduct(productHash).productName
        );
    }

    function productsSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).sent[from];
    }

    function productsReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).received[from];
    }

    function productExists(bytes32 productHash) public view returns (bool) {
        return _getProduct(productHash).purchaser != address(0);
    }

    function _getProduct(bytes32 productHash)
        internal
        view
        returns (Product storage)
    {
        return _products[productHash];
    }

}
