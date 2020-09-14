// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "../ERC721Token/ERC721Logistic/ERC721LogisticInterface.sol";
import "../name/NameInterface.sol";
import "../access/AccessInterface.sol";
import "../access/owner/OwnerInterface.sol";
import "../product/ProductInterface.sol";
import "../pause/PauseInterface.sol";
import "../handover/HandoverInterface.sol";
import "../upgradeability/proxy/IOwnedUpgradeabilityProxy.sol";


/**
 * @title LogisticInterface
 * @dev The interface used to interact with the Logistic contract.
 */
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
