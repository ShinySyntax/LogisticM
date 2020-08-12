pragma solidity ^0.5.0;

import "./ILogisticBase.sol";
import "./Proxy.sol";


contract Logistic is Proxy {
    // Naming convention:
    //    uint256 tokenId (ERC721)
    //    bytes32 productHash
    //    string productName

    event NewProduct(
        address indexed by,
        address indexed purchaser,
        bytes32 indexed productHash,
        string productName
    );

    event ProductShipped(
        address indexed from,
        address indexed to,
        bytes32 indexed productHash,
        string productName
    );

    event ProductReceived(
        address indexed from,
        address indexed by,
        bytes32 indexed productHash,
        string productName
    );

    event Handover(
        address indexed from,
        address indexed to, bytes32
        indexed productHash,
        string productName
    );

    ILogisticBase private logisticBase;

    modifier onlySupplier {
        require(
            logisticBase.isSupplier(msg.sender),
            "Logistic: caller is not supplier");
        _;
    }

    modifier notSupplier {
        require(
            !logisticBase.isSupplier(msg.sender),
            "Logistic: caller is owner");
        _;
    }

    modifier supplierOrDeliveryMan {
        require(
            logisticBase.isSupplier(msg.sender)
                || logisticBase.isDeliveryMan(msg.sender),
            "Logistic: caller is not supplier nor delivery man");
        _;
    }

    modifier onlyOwner {
        require(
            logisticBase.owner() == msg.sender,
            "Logistic: caller is not owner");
        _;
    }

    modifier notOwner {
        require(
            logisticBase.owner() != msg.sender,
            "Logistic: caller is owner");
        _;
    }

    constructor (address logisticBaseAddress) public {
        logisticBase = ILogisticBase(logisticBaseAddress);
    }

    function test() public returns (address, uint256, address, address, address) {
        return logisticBase.howIAm(66);
    }

    function implementation() public view returns (address) {
        return address(logisticBase);
    }

    function setLogisticBaseAddress(address logisticBaseAddress) public onlyOwner {
        logisticBase = ILogisticBase(logisticBaseAddress);
    }

    function createProductWithName(
        address purchaser,
        bytes32 productHash,
        string calldata productName,
        string calldata purchaserName
    )
        external
        onlySupplier
    {
        logisticBase.setName(purchaser, purchaserName);
        createProduct(purchaser, productHash, productName);
    }

    function createProduct(
        address purchaser,
        bytes32 productHash,
        string memory productName
    )
        public
        onlySupplier
    {
        require(logisticBase.owner() != purchaser
            // && !logisticBase.isSupplier(purchaser)
            && !logisticBase.isDeliveryMan(purchaser),
            "Logistic: Can't create for supplier nor owner nor delivery man");
        (address purchaser_, uint256 tokenId, string memory productName_) = logisticBase.getProductInfo(productHash);
        require(
            tokenId == 0,
            "Logistic: This product already exists"
        );

        tokenId = logisticBase.counter();
        logisticBase.newProduct(msg.sender, productHash, purchaser, tokenId, productName);

        emit NewProduct(msg.sender, purchaser, productHash, productName);
        // assert(_productExists(productHash, productName));
    }

    function sendWithName(string calldata receiverName, bytes32 productHash)
        external
        supplierOrDeliveryMan
    {
        send(logisticBase.addresses(receiverName), productHash);
    }

    function send(address receiver, bytes32 productHash) public
        supplierOrDeliveryMan
    {
        require(logisticBase.productsSentFrom(productHash, msg.sender) == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(logisticBase.owner() != receiver && !logisticBase.isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        (address purchaser, uint256 tokenId, string memory productName) = logisticBase.getProductInfo(productHash);
        if (!logisticBase.isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            require(purchaser == receiver,
                "Logistic: This purchaser has not ordered this product");
        }

        if (logisticBase.productsReceivedFrom(productHash, msg.sender) == receiver) {
            _handoverToken(msg.sender, receiver, productHash);
        } else {
            logisticBase.approve(receiver, tokenId);
        }
        logisticBase.setProductSent(productHash, msg.sender, receiver);

        emit ProductShipped(msg.sender, receiver, productHash, productName);
    }

    function receiveWithName(string calldata senderName, bytes32 productHash)
        external
        notOwner
    {
        receive(logisticBase.addresses(senderName), productHash);
    }

    function receive(address sender, bytes32 productHash)
        public
        notOwner
        notSupplier
    {
        require(logisticBase.productsReceivedFrom(productHash, sender) == address(0),
            "Logistic: Already received");
        require(logisticBase.isSupplier(sender)
                || logisticBase.isDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        (address purchaser, uint256 tokenId_, string memory productName) = logisticBase.getProductInfo(productHash);
        if (!logisticBase.isDeliveryMan(msg.sender)) {
            // the caller is a purchaser
            require(purchaser == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }

        if (logisticBase.productsSentFrom(productHash, sender) == msg.sender) {
            _handoverToken(sender, msg.sender, productHash);
        }
        logisticBase.setProductReceived(productHash, sender, msg.sender);

        emit ProductReceived(sender, msg.sender, productHash, productName);
    }

    function _handoverToken(address from, address to, bytes32 productHash)
        internal
    {
        (address purchaser_, uint256 tokenId, string memory productName) = logisticBase.getProductInfo(productHash);
        logisticBase.transferFrom(from, to, tokenId);
        emit Handover(from, to, productHash, productName);
    }
}
