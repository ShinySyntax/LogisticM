pragma solidity ^0.5.0;

import "./roles/SupplierRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";
import "./RestrictedERC721.sol";
import "./Named.sol";


contract Logistic is RestrictedERC721, Named, OwnerRole, DeliveryManRole,
SupplierRole {
    // Naming convention:
    //    uint256 tokenId (ERC721)
    //    bytes32 productHash
    //    string productName

    struct Product {
        address purchaser;
        uint256 tokenId;
        string productName;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    // Mapping from productHash to Product
    mapping (bytes32 => Product) private _products;

    // Mapping from tokenId to productHash
    mapping (uint256 => bytes32) private _tokenToProductHash;

    event NewProduct(address indexed by, address indexed purchaser, bytes32 indexed productHash, string productName);
    event ProductShipped(address indexed from, address indexed to, bytes32 indexed productHash, string productName);
    event ProductReceived(address indexed from, address indexed by, bytes32 indexed productHash, string productName);
    event Handover(address indexed from, address indexed to, bytes32 indexed productHash, string productName);

    modifier supplierOrDeliveryMan() {
        require(_isSupplierOrDeliveryMan(msg.sender),
            "Logistic: caller does not have the Supplier role nor the DeliveryMan role");
        _;
    }

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

    function addSupplier(address account, string memory name_) public
    onlyOwner {
        require(!isDeliveryMan(account), "Logistic: Account is delivery man");
        require(owner() != account, "Logistic: Owner can't be supplier");

        _setName(account, name_);
        _addSupplier(account, name_);
    }

    function addDeliveryMan(address account, string memory name_) public
    onlyOwner {
        require(!isSupplier(account), "Logistic: Account is supplier");
        require(owner() != account, "Logistic: Owner can't be delivery man");

        _setName(account, name_);
        _addDeliveryMan(account, name_);
    }

    function createProductWithName(address purchaser,
    bytes32 productHash, string memory productName, string memory purchaserName)
    public onlySupplier {
        _setName(purchaser, purchaserName);
        createProduct(purchaser, productHash, productName);
    }

    function createProduct(address purchaser, bytes32 productHash,
    string memory productName) public onlySupplier {
        require(owner() != purchaser && !_isSupplierOrDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");
        uint256 tokenId = _getCounter();
        require(
            _getProduct(_tokenToProductHash[tokenId]).purchaser == address(0),
            "Logistic: This product already exists"
        );

        _tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(purchaser, tokenId, productName);
        _mint(msg.sender);

        emit NewProduct(msg.sender, purchaser, productHash, productName);
        assert(
            _getProduct(_tokenToProductHash[tokenId]).purchaser == address(0)
        );
    }

    function sendWithName(string memory receiverName, bytes32 productHash)
    public supplierOrDeliveryMan {
        send(addressByName(receiverName), productHash);
    }

    function send(address receiver, bytes32 productHash) public
    supplierOrDeliveryMan {
        require(productsSentFrom(productHash, msg.sender) == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(owner() != receiver && !isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            require(productsOrders(productHash) == receiver,
                "Logistic: This purchaser has not ordered this product");
        }

        if (productsReceivedFrom(productHash, msg.sender) == receiver) {
            _handoverToken(msg.sender, receiver, productHash);
        } else {
            _restrictedMode = false;
            approve(receiver, _getProduct(productHash).tokenId);
            _restrictedMode = true;
        }
        _setProductSent(productHash, msg.sender, receiver);

        emit ProductShipped(msg.sender, receiver, productHash,
            _getProduct(productHash).productName);
    }

    function receiveWithName(string memory senderName, bytes32 productHash)
    public notOwner {
        receive(addressByName(senderName), productHash);
    }

    function receive(address sender, bytes32 productHash)
    public notOwner notSupplier {
        require(productsReceivedFrom(productHash, sender) == address(0),
            "Logistic: Already received");
        require(_isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!isDeliveryMan(msg.sender)) {
            // the caller is a purchaser
            require(productsOrders(productHash) == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        if (productsSentFrom(productHash, sender) == msg.sender) {
            _handoverToken(sender, msg.sender, productHash);
        }
        _setProductReceived(productHash, sender, msg.sender);

        emit ProductReceived(sender, msg.sender, productHash,
            _getProduct(productHash).productName);
    }

    function _handoverToken(address from, address to, bytes32 productHash)
    internal {
        _restrictedMode = false;
        transferFrom(from, to, _getProduct(productHash).tokenId);
        _restrictedMode = true;
        emit Handover(from, to, productHash,
            _getProduct(productHash).productName);
    }

    function _setProductSent(bytes32 productHash, address from, address to)
    internal {
        _getProduct(productHash).sent[from] = to;
    }

    function _setProductReceived(bytes32 productHash, address from,
    address by) internal {
        _getProduct(productHash).received[from] = by;
    }

    function _getProduct(bytes32 productHash) internal view
    returns (Product storage) {
        return _products[productHash];
    }

    function _isSupplierOrDeliveryMan(address account) internal view
    returns (bool) {
        return isSupplier(account) || isDeliveryMan(account);
    }
}
