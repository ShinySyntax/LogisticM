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
    mapping (bytes32 => Product) public _products;

    // Mapping from tokenId to productHash
    mapping (uint256 => bytes32) public _tokenToProductHash;

    address private _owner;
    address private _logistic;

    modifier onlyLogistic() {
        require(msg.sender == _logistic);
        _;
    }

    constructor() public {
        _owner = msg.sender;
    }

    function setLogisticAddress(address logistic) public {
        require(msg.sender == _owner);
        _logistic = logistic;
    }

    function productsOrders(bytes32 productHash) public view returns (address) {
        return _getProduct(productHash).purchaser;
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

    function getProductHash(uint256 tokenId) public view returns (bytes32) {
        return _tokenToProductHash[tokenId];
    }

    function getProductName(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return _getProduct(_tokenToProductHash[tokenId]).productName;
    }

    function productExists(bytes32 productHash) public view returns (bool) {
        return _getProduct(productHash).purchaser != address(0);
    }

    function getTokenId(bytes32 productHash) public view returns (uint256) {
        return _products[productHash].tokenId;
    }

    function getProductName(bytes32 productHash) public view
    returns (string memory) {
        return _products[productHash].productName;
    }

    function _setProductSent(bytes32 productHash, address from, address to)
        public
        onlyLogistic
    {
        _getProduct(productHash).sent[from] = to;
    }

    function _setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        public
        onlyLogistic
    {
        _getProduct(productHash).received[from] = by;
    }

    function _createProduct(
        bytes32 productHash,
        uint256 tokenId,
        address purchaser,
        string memory productName
    )
        public
        onlyLogistic
    {
        _tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
    }

    function _getProduct(bytes32 productHash)
        internal
        view
        returns (Product storage)
    {
        return _products[productHash];
    }
}
