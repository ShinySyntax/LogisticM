// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "../ERC721Token/ERC721LogisticM/ERC721LogisticMInterface.sol";
import "../name/NameInterface.sol";
import "../access/AccessInterface.sol";
import "../access/owner/OwnerInterface.sol";
import "../product/ProductInterface.sol";
import "../pause/PauseInterface.sol";
import "../handover/HandoverInterface.sol";
import "../upgradeability/proxy/IOwnedUpgradeabilityProxy.sol";


/**
 * @title LogisticMInterface
 * @dev The interface used to interact with the LogisticM contract.
 */
contract LogisticMInterface is
    ERC721LogisticMInterface,
    NameInterface,
    AccessInterface,
    OwnerInterface,
    ProductInterface,
    PauseInterface,
    HandoverInterface,
    IOwnedUpgradeabilityProxy {

    function setLock(bool lock_) external;
}
