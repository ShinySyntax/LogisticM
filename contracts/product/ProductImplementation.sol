pragma solidity ^0.5.0;

import "../logistic/LogisticSharedStorage.sol";
import "./ProductInterface.sol";
import "../commons/Lock.sol";
import "../commons/BytesLib.sol";


contract ProductImplementation is ProductInterface, LogisticSharedStorage, Lock {
    function newProduct(
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        bytes32 productNameBytes32
    )
        public
        locked(lock)
    {
        string memory productName = BytesLib.bytes32ToString(productNameBytes32);
        tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
        emit NewProduct(msg.sender, purchaser, productHash, productName);
    }

    function setProductSent(
        bytes32 productHash,
        address from,
        address to
    )
        public
        locked(lock)
    {
        require(from != address(0), "Product: from is the zero address");
        require(to != address(0), "Product: to is the zero address");

        _getProduct(productHash).sent[from] = to;
        string memory productName = _getProduct(productHash).productName;
        emit ProductShipped(from, to, productHash, productName);
    }

    function setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        public
        locked(lock)
    {
        require(from != address(0), "Product: from is the zero address");
        require(by != address(0), "Product: by is the zero address");

        _getProduct(productHash).received[from] = by;
        (
            address purchaser,
            uint256 tokenId,
            string memory productName
        ) = getProductInfo(productHash);
        emit ProductReceived(from, by, productHash, productName);
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

    function productSentFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).sent[from];
    }

    function productReceivedFrom(bytes32 productHash, address from)
        public
        view
        returns (address)
    {
        return _getProduct(productHash).received[from];
    }

    function getHashFromTokenId(uint256 tokenId) public view returns (bytes32) {
        return tokenToProductHash[tokenId];
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
