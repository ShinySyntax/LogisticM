pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

import "./roles/SupplierRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";


contract Logistic is ERC721Full, OwnerRole, DeliveryManRole, SupplierRole {
    // the token (uint256) is send from (address) to (address)
    mapping (uint256 => mapping (address => address)) private _tokensSent;

    // the token (uint256) has been received from (address) by (address)
    mapping (uint256 => mapping (address => address)) private _tokensReceived;

    // the purchaser (address) has ordered the token (uint256)
    mapping (uint256 => address) private _orders;

    bool private restrictedMode;

    event NewProduct(address indexed by, address indexed purchaser, uint256 indexed tokenId);
    event ProductShipped(address indexed from, address indexed to, uint256 indexed tokenId);
    event ProductReceived(address indexed from, address indexed by, uint256 indexed tokenId);
    event Handover(address indexed from, address indexed to, uint256 indexed tokenId);

    modifier supplierOrDeliveryMan() {
        require(_isSupplierOrDeliveryMan(msg.sender),
            "Logistic: caller does not have the Supplier role nor the DeliveryMan role");
        _;
    }

    modifier whenNotRestrictedMode() {
        require(restrictedMode == false,
            "Logistic: restricted mode activated"
        );
        _;
    }

    constructor() public ERC721Full("Logistic", "LM") {
        restrictedMode = true;
        renounceDeliveryMan();
        renounceSupplier();
    }

    function tokensSentFrom(uint256 tokenId, address from) external view returns (address) {
        return _tokensSent[tokenId][from];
    }

    function tokensReceivedFrom(uint256 tokenId, address from) external view returns (address) {
        return _tokensReceived[tokenId][from];
    }

    function orders(uint256 tokenId) external view returns (address) {
        return _orders[tokenId];
    }

    function approve(address to, uint256 tokenId) public whenNotRestrictedMode {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        revert("Logistic: cannot approve for all");
    }

    function addSupplier(address account) public onlyOwner {
        require(!isDeliveryMan(account), "Account is delivery man");
        require(owner() != account, "Owner can't be supplier");
        _addSupplier(account);
    }

    function addDeliveryMan(address account) public onlyOwner {
        require(!isSupplier(account), "Account is supplier");
        require(owner() != account, "Owner can't be delivery man");
        _addDeliveryMan(account);
    }

    function createProduct(address purchaser, uint256 tokenId) public onlySupplier {
        _mint(msg.sender, tokenId);
        _orders[tokenId] = purchaser;
        emit NewProduct(msg.sender, purchaser, tokenId);
    }

    function send(address receiver, uint256 tokenId) public supplierOrDeliveryMan {
        require(_tokensSent[tokenId][msg.sender] == address(0),
            "Logistic: Can't send a product in pending delivery");
        require(owner() != receiver && !isSupplier(receiver),
            "Logistic: Can't send to supplier nor owner");
        if (!isDeliveryMan(receiver)) {
            // the receiver is a purchaser
            require(_orders[tokenId] == receiver,
                "Logistic: This purchaser has not ordered this product");
        }
        if (_tokensReceived[tokenId][msg.sender] == receiver) {
            handoverToken(msg.sender, receiver, tokenId);
        } else {
            restrictedMode = false;
            approve(receiver, tokenId);
            restrictedMode = true;
        }
        _tokensSent[tokenId][msg.sender] = receiver;
        emit ProductShipped(msg.sender, receiver, tokenId);
    }

    function receive(address sender, uint256 tokenId) public notOwner
    notSupplier {
        require(_tokensReceived[tokenId][sender] == address(0),
            "Logistic: Already received");
        require(_isSupplierOrDeliveryMan(sender),
            "Logistic: sender is not delivery man nor supplier");
        if (!isDeliveryMan(msg.sender)) {
            require(_orders[tokenId] == msg.sender,
                "Logistic: This purchaser has not ordered this product");
        }
        if (_tokensSent[tokenId][sender] == msg.sender) {
            handoverToken(sender, msg.sender, tokenId);
        }
        _tokensReceived[tokenId][sender] = msg.sender;
        emit ProductReceived(sender, msg.sender, tokenId);
    }

    function handoverToken(address from, address to, uint256 tokenId) internal {
        restrictedMode = false;
        transferFrom(from, to, tokenId);
        restrictedMode = true;
        emit Handover(from, to, tokenId);
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    whenNotRestrictedMode {
        super._transferFrom(from, to, tokenId);
    }

    function _isSupplierOrDeliveryMan(address account) private view returns (bool) {
        return isSupplier(account) || isDeliveryMan(account);
    }
}
