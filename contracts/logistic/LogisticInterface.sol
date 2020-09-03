pragma solidity ^0.5.0;

import "../ERC721Token/ERC721Logistic/ERC721LogisticInterface.sol";
import "../name/NameInterface.sol";
import "../access/AccessInterface.sol";
import "../access/owner/OwnerInterface.sol";
import "../product/ProductInterface.sol";
import "../pause/PauseInterface.sol";
import "../handover/HandoverInterface.sol";
import "../upgradeability/proxy/IOwnedUpgradeabilityProxy.sol";


contract LogisticInterface is
    ERC721LogisticInterface,
    NameInterface,
    AccessInterface,
    OwnerInterface,
    ProductInterface,
    PauseInterface,
    HandoverInterface,
    IOwnedUpgradeabilityProxy {

    function setLock(bool lock_) external;
}
