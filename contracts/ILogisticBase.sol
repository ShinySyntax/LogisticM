pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Full.sol";


contract ILogisticBase is IERC721Full {
    function howIAm(uint256 a) external view returns (address, uint256, address, address, address);
    event TestCall(address indexed caller);
    function howIsCalling() external;

    function setLogistic(address newLogistic) external;

    uint256 public counter;

    mapping (address => string) public names;
    mapping (string => address) public addresses;
    function setName(address account, string calldata name) external;

    function addSupplier(address account, string calldata name_) external;
    function removeSupplier(address account) external;
    function addDeliveryMan(address account, string calldata name_) external;
    function removeDeliveryMan(address account) external;
    function isDeliveryMan(address account) external view returns (bool);
    function renounceDeliveryMan() external;
    address public owner;
    function transferOwnership(address newOwner) external;
    function isSupplier(address account) external view returns (bool);
    function renounceSupplier() external;

    event Paused(address account);
    event Unpaused(address account);
    bool public paused;
    function pause() public;
    function unpause() public;

    mapping (uint256 => bytes32) public tokenToProductHash;
    function newProduct(
        address supplier,
        bytes32 productHash,
        address purchaser,
        uint256 tokenId,
        string calldata productName
    ) external;
    function getProductInfo(bytes32 productHash)
        external
        view
        returns (
            address,
            uint256,
            string memory
        );
    function productsSentFrom(bytes32 productHash, address from) external view
        returns (address);
    function productsReceivedFrom(bytes32 productHash, address from) external
        view returns (address);
    function setProductSent(bytes32 productHash, address from, address to)
        external;
    function setProductReceived(
        bytes32 productHash,
        address from,
        address by
    )
        external;
}
