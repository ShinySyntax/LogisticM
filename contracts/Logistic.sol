pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

import "./roles/MakerRole.sol";
import "./roles/DeliveryManRole.sol";
import "./roles/OwnerRole.sol";


contract Logistic is ERC721Full, OwnerRole, DeliveryManRole, MakerRole {
    mapping (uint256 => address) private _pendingDeliveries;
    bool private restrictedMode;

    event ProductShipped(address indexed from, address indexed to, uint256 indexed tokenId);
    event ProductReceived(address indexed from, address indexed by, uint256 indexed tokenId);

    modifier makerOrDeliveryMan() {
        require(_isMakerOrDeliveryMan(msg.sender),
            "Logistic: caller does not have the Maker role nor the DeliveryMan role");
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
        renounceMaker();
    }

    function pendingDeliveries(uint256 tokenId) external view returns (address) {
        return _pendingDeliveries[tokenId];
    }

    function approve(address to, uint256 tokenId) public whenNotRestrictedMode {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        revert("Logistic: cannot approve for all");
    }

    function addMaker(address account) public onlyOwner {
        require(!isDeliveryMan(account), "Account is delivery man");
        require(owner() != account, "Owner can't be maker");
        _addMaker(account);
    }

    function addDeliveryMan(address account) public onlyOwner {
        require(!isMaker(account), "Account is maker");
        require(owner() != account, "Owner can't be delivery man");
        _addDeliveryMan(account);
    }

    function newItem(uint256 tokenId) public onlyMaker {
        _mint(msg.sender, tokenId);
    }

    function send(address receiver, uint256 tokenId) public makerOrDeliveryMan {
        require(_pendingDeliveries[tokenId] == address(0),
            "Logistic: Can't send an item in pending delivery");
        require(isDeliveryMan(receiver), "Logistic: receiver is not a delivery man");
        // assert(ownerOf(tokenId) == msg.sender);
        restrictedMode = false;
        approve(receiver, tokenId);
        restrictedMode = true;
        _pendingDeliveries[tokenId] = receiver;
        emit ProductShipped(msg.sender, receiver, tokenId);
    }

    function receive(address sender, uint256 tokenId) public onlyDeliveryMan {
        require(_pendingDeliveries[tokenId] == msg.sender,
            "Logistic: Can't receive an item not delivered");
        // require(_isMakerOrDeliveryMan(sender),
        //     "Logistic: sender is not delivery man nor maker");
        restrictedMode = false;
        transferFrom(sender, msg.sender, tokenId);
        restrictedMode = true;
        _pendingDeliveries[tokenId] = address(0);
        emit ProductReceived(sender, msg.sender, tokenId);
    }

    function sendToPurchaser(uint256 tokenId) public makerOrDeliveryMan {
        require(_pendingDeliveries[tokenId] == address(0),
            "Logistic: Can't send to purchaser an item in pending delivery");
        _burn(msg.sender, tokenId);
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal
    whenNotRestrictedMode {
        super._transferFrom(from, to, tokenId);
    }

    function _isMakerOrDeliveryMan(address account) private view returns (bool) {
        return isMaker(account) || isDeliveryMan(account);
    }
}
