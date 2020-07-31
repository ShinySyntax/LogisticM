pragma solidity ^0.5.0;

import "./roles/SupplierRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";
import "./RestrictedERC721.sol";
import "./Named.sol";


contract Logistic is RestrictedERC721, Named, OwnerRole, DeliveryManRole,
SupplierRole {
    // Naming convention:
    //    string productId
    //    uint256 tokenId (ERC721)
    //    bytes32 productHash

    struct Product {
        string productId;
        address purchaser;
        uint256 tokenId;
        mapping (address => address) sent; // from -> to
        mapping (address => address) received; // from -> by
    }

    // Mapping from productHash to Product
    mapping (bytes32 => Product) private _products;

    // Mapping from tokenId to productId
    mapping (uint256 => bytes32) private _tokenToProductHash;

    event NewProduct(address indexed by, address indexed purchaser, string productId);
    event ProductShipped(address indexed from, address indexed to, string productId);
    event ProductReceived(address indexed from, address indexed by, string productId);
    event Handover(address indexed from, address indexed to, string productId);

    modifier supplierOrDeliveryMan() {
        require(_isSupplierOrDeliveryMan(msg.sender),
            "Logistic: caller does not have the Supplier role nor the DeliveryMan role");
        _;
    }

    function productsOrders(string memory productId) public view
    returns (address) {
        return _products[keccak256(bytes(productId))].purchaser;
    }

    function productsSentFrom(string memory productId, address from) public view
    returns (address) {
        return _products[keccak256(bytes(productId))].sent[from];
    }

    function productsReceivedFrom(string memory productId, address from) public
    view
    returns (address) {
        return _products[keccak256(bytes(productId))].received[from];
    }

    function getTokenId(string memory productId) public view
    returns (uint256) {
        return _products[keccak256(bytes(productId))].tokenId;
    }

    function getProductId(uint256 tokenId) public view returns (string memory) {
        return _products[_tokenToProductHash[tokenId]].productId;
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

    function createProductWithName(address purchaser, string memory productId,
    string memory purchaserName) public onlySupplier {
        _setName(purchaser, purchaserName);
        createProduct(purchaser, productId);
    }

    function createProduct(address purchaser, string memory productId) public
    onlySupplier {
        require(owner() != purchaser && !_isSupplierOrDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");

        uint256 tokenId = _getCounter();
        bytes32 productHash = keccak256(bytes(productId));

        _tokenToProductHash[tokenId] = productHash;
        _products[productHash] = Product(productId, purchaser, tokenId);
        _mint(msg.sender);

        emit NewProduct(msg.sender, purchaser, productId);
    }

    function send(address receiver, string memory productId) public
    supplierOrDeliveryMan {
        require(productsSentFrom(productId, msg.sender) == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(owner() != receiver && !isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            require(productsOrders(productId) == receiver,
                "Logistic: This purchaser has not ordered this product");
        }

        if (productsReceivedFrom(productId, msg.sender) == receiver) {
            _handoverToken(msg.sender, receiver, productId);
        } else {
            _restrictedMode = false;
            approve(receiver, _getProduct(productId).tokenId);
            _restrictedMode = true;
        }
        _setProductSent(productId, msg.sender, receiver);

        emit ProductShipped(msg.sender, receiver, productId);
    }

    function receive(address sender, string memory productId) public notOwner
    notSupplier {
        require(productsReceivedFrom(productId, sender) == address(0),
            "Logistic: Already received");
        require(_isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!isDeliveryMan(msg.sender)) {
            // the caller is a purchaser
            require(productsOrders(productId) == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        if (productsSentFrom(productId, sender) == msg.sender) {
            _handoverToken(sender, msg.sender, productId);
        }
        _setProductReceived(productId, sender, msg.sender);

        emit ProductReceived(sender, msg.sender, productId);
    }

    function _handoverToken(address from, address to, string memory productId)
    internal {
        _restrictedMode = false;
        transferFrom(from, to, _getProduct(productId).tokenId);
        _restrictedMode = true;
        emit Handover(from, to, productId);
    }

    function _setProductSent(string memory productId, address from, address to)
    internal {
        _getProduct(productId).sent[from] = to;
    }

    function _setProductReceived(string memory productId, address from,
    address by) internal {
        _getProduct(productId).received[from] = by;
    }

    function _getProduct(string memory productId) internal view
    returns (Product storage) {
        return _products[keccak256(bytes(productId))];
    }

    function _isSupplierOrDeliveryMan(address account) internal view
    returns (bool) {
        return isSupplier(account) || isDeliveryMan(account);
    }
}
