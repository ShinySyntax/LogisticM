pragma solidity ^0.5.0;


contract ProductManager {
    struct Product {
        address purchaser;
        uint256 tokenId;
        string productName;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    // Mapping from productHash to Product
    mapping (bytes32 => Product) internal _products;

    // Mapping from tokenId to productHash
    mapping (uint256 => bytes32) internal _tokenToProductHash;

    function productsOrders(bytes32 productHash) public view returns (address) {
        return _getProduct(productHash).purchaser;
    }

    function productsSentFrom(bytes32 productHash, address from) public view
    returns (address) {
        return _getProduct(productHash).sent[from];
    }

    function productsReceivedFrom(bytes32 productHash, address from) public
    view returns (address) {
        return _getProduct(productHash).received[from];
    }

    function getProductHash(uint256 tokenId) public view returns (bytes32) {
        return _tokenToProductHash[tokenId];
    }

    function getProductName(uint256 tokenId) public view
    returns (string memory) {
        return _getProduct(_tokenToProductHash[tokenId]).productName;
    }

    function _setProductSent(bytes32 productHash, address from, address to)
    internal {
        _getProduct(productHash).sent[from] = to;
    }

    function _setProductReceived(bytes32 productHash, address from,
    address by) internal {
        _getProduct(productHash).received[from] = by;
    }

    function _productExists(bytes32 productHash, string memory productName)
    internal view returns (bool) {
        return _getProduct(productHash).purchaser != address(0);
    }

    function _getProduct(bytes32 productHash) internal view
    returns (Product storage) {
        return _products[productHash];
    }

    function _getTokenId(bytes32 productHash) internal view returns (uint256) {
        return _products[productHash].tokenId;
    }

    function _getProductName(bytes32 productHash) internal view
    returns (string memory) {
        return _products[productHash].productName;
    }
}
