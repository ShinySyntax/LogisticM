pragma solidity ^0.5.0;

import "./LogisticEvents.sol";
import "../ERC721Token/ERC721Logistic/ERC721LogisticInterface.sol";
import "../name/NameInterface.sol";
import "../access/AccessInterface.sol";
import "../access/owner/OwnerInterface.sol";
import "../product/ProductInterface.sol";
import "../pause/PauseInterface.sol";
import "../proxy/IUpgradeabilityProxy.sol";


contract LogisticInterface is
    LogisticEvents,
    ERC721LogisticInterface,
    NameInterface,
    AccessInterface,
    OwnerInterface,
    ProductInterface,
    PauseInterface,
    IUpgradeabilityProxy {

    function createProduct(
        address purchaser,
        bytes32 productHash,
        string calldata productName,
        string calldata purchaserName
    ) external;

    function send(address to, bytes32 productHash) external;
    function receive(address from, bytes32 productHash) external;
    function setLock(bool lock_) external;
    function initializeLogistic(address sender) external;
}
